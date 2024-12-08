import { sendEmail } from "../utils/email.js";
import { 
    saveResetToken, 
    validateResetToken, 
    updatePassword, 
    saveEmailVerificationToken, 
    verifyEmailToken, 
    findUserByEmail 
} from "../models/auth.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { generateToken } from "../middlewares/auth.js"; // Import the token generation logic

// Register a new user
export async function registerUser(req, res) {
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

    try {
        // Check if the user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(user_password, 10);

        // Save the user in the database
        const newUser = await saveUser({
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
            user_password: hashedPassword,
        });

        // Generate a token
        const token = generateToken(newUser);

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Login user
export async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.user_password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = generateToken(user); // Generate a JWT
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Request password reset
export async function requestPasswordReset(req, res) {
    const { email } = req.body;
    try {
        const token = crypto.randomBytes(32).toString("hex");
        await saveResetToken(email, token);

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
        await sendEmail(email, "Password Reset", `Reset your password here: ${resetLink}`);

        res.json({ message: "Password reset link sent to your email" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Reset password
export async function resetPassword(req, res) {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const email = await validateResetToken(token);
        if (!email) return res.status(400).json({ error: "Invalid or expired token" });

        await updatePassword(email, newPassword);
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Verify email
export async function verifyEmail(req, res) {
    const { token } = req.params;
    try {
        const email = await verifyEmailToken(token);
        if (!email) return res.status(400).json({ error: "Invalid or expired token" });

        res.json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
