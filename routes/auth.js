import express from "express";
import { createUser } from "../models/users.js";
import { loginUser, requestPasswordReset, resetPassword, verifyEmail, registerUser } from "../controllers/auth.js";

const router = express.Router();

// Login route
router.post("/login", loginUser);

// Password reset and email verification routes
router.post("/password-reset", requestPasswordReset);

// User registration
router.post("/register", registerUser);

// Request password reset
router.post("/forgot-password", requestPasswordReset);

// Reset password
router.post("/reset-password/:token", resetPassword);

// Verify email
router.get("/verify-email/:token", verifyEmail);

router.post("/signup", async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
