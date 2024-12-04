import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import usersRoutes from "./routes/users.js";
import categoryRoutes from "./routes/categories.js";
import ProductRoutes from "./routes/products.js";
import OrderRoutes from "./routes/orders.js";
import OrderDetails from "./routes/orderDetails.js";
import PaymentRoutes from "./routes/payment.js";
import DeliveryRoutes from "./routes/delivery.js";
import ServiceRoutes from "./routes/services.js";
import FeedbacksRoutes from "./routes/feedbacks.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

// Create a Nodemailer transporter using your email service (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail", // You can change this if you're using a different provider
  auth: {
    user: "mithilsuthar2603@gmail.com", // Your email address here
    pass: process.env.MyPASS,  // Your email password or app-specific password
  },
});

// middlewares
app.use(cors()); // Add CORS middleware here
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", ProductRoutes);
app.use("/orders", OrderRoutes);
app.use("/orderdetails", OrderDetails);
app.use("/payments", PaymentRoutes);
app.use("/delivery", DeliveryRoutes);
app.use("/services", ServiceRoutes);
app.use("/feedbacks", FeedbacksRoutes);

// Route to handle sending inquiries
app.post("/send-inquiry", async (req, res) => {
  const { email, inquiry } = req.body;

  const mailOptions = {
    from: email,
    to: "mithilsuthar2603@gmail.com",  // The email address you want to send to
    subject: "New Inquiry",
    text: `Inquiry from ${email}:\n\n${inquiry}`,
  };

  try {
    await transporter.sendMail(mailOptions); // Send the email using the transporter
    res.status(200).json({ message: "Inquiry sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error); // Log the actual error
    res.status(500).json({ error: "Error sending inquiry." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
