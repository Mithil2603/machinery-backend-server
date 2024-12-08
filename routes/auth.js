import express from "express";
import twilio from "twilio";
import bcrypt from "bcryptjs";
import pool from "../db_connect.js"; // Correct database import

const router = express.Router();

// Twilio Configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// In-memory OTP store (replace with Redis for production)
const otpStore = {};

// Route to send OTP
router.post("/request-otp", async (req, res) => {
  const { phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).json({ error: "Phone number is required." });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: twilioPhoneNumber,
      to: phone_number,
    });

    // Store OTP in memory
    otpStore[phone_number] = otp;

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
});

// Route to verify OTP
router.post("/verify-otp", (req, res) => {
  const { phone_number, otp } = req.body;

  if (!phone_number || !otp) {
    return res.status(400).json({ error: "Phone number and OTP are required." });
  }

  const storedOtp = otpStore[phone_number];

  if (storedOtp && parseInt(otp) === storedOtp) {
    // OTP is valid
    delete otpStore[phone_number]; // Remove OTP after verification
    res.status(200).json({ verified: true });
  } else {
    res.status(400).json({ error: "Invalid OTP." });
  }
});

// Route to register user (after OTP verification)
router.post("/register", async (req, res) => {
  const {
    user_type,
    first_name,
    last_name,
    phone_number,
    email,
    company_name,
    company_address,
    address_city,
    address_state,
    address_country,
    GST_no,
    user_password,
  } = req.body;

  if (!first_name || !last_name || !phone_number || !email || !user_password) {
    return res.status(400).json({ error: "All required fields must be filled." });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Save user to the database
    const sql = `
      INSERT INTO user_tbl (
        user_type, first_name, last_name, phone_number, email,
        company_name, company_address, address_city, address_state,
        address_country, GST_no, user_password
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      user_type, first_name, last_name, phone_number, email,
      company_name, company_address, address_city, address_state,
      address_country, GST_no, hashedPassword,
    ];

    const [result] = await pool.query(sql, values);

    res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

export default router;
