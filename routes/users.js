import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../models/users.js";

import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Get all users
router.get("/", authenticate, authorize(["Owner"]), async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a user by ID
router.get("/:id", authenticate, authorize(["Owner", "Admin"]), async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
router.post("/signup", async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign in a user
router.post("/signin", async (req, res) => {
  try {
    const { email, user_password } = req.body;

    const user = await getUserByEmail(email); // Write this function if needed
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await verifyPassword(user_password, user.user_password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user
router.patch("/:id", authenticate, async (req, res) => {
  try {
    await updateUser(req.params.id, req.body);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user
router.delete("/:id", authenticate, authorize(["Owner"]), async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;