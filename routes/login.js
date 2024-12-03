import express from "express";
import { getUserByEmail, verifyPassword } from "../models/users.js";
import { generateToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await verifyPassword(password, user.user_password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
