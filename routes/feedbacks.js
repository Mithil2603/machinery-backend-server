import express from "express";
import {
    getFeedbacks,
    getFeedback,
    createFeedback,
    updateFeedback,
    deleteFeedback,
} from "../models/feedbacks.js";

const router = express.Router(); 

// Get all feedbacks
router.get("/", async (req, res) => {
  try {
    const feedback = await getFeedbacks();
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a feedback by ID
router.get("/:id", async (req, res) => {
  try {
    const feedback = await getFeedback(req.params.id);
    if (!feedback) return res.status(404).json({ error: "Feedback not found" });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new feedback
router.post("/", async (req, res) => {
  try {
    const newFeedback = await createFeedback(req.body);
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a feedback
router.patch("/:id", async (req, res) => {
  try {
    await updateFeedback(req.params.id, req.body);
    res.json({ message: "Feedback updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a feedback
router.delete("/:id", async (req, res) => {
  try {
    await deleteFeedback(req.params.id);
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
