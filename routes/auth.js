import express from "express";
import { createUser } from "../models/users.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
