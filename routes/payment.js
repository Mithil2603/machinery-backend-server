import express from "express";
import {
    getPayments,
    getPayment,
    createPayment,
    updatePayment,
    deletePayment,
} from "../models/payment.js";

const router = express.Router(); 

// Get all payments
router.get("/", async (req, res) => {
  try {
    const payment = await getPayments();
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a payment by ID
router.get("/:id", async (req, res) => {
  try {
    const payment = await getPayment(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new payment
router.post("/", async (req, res) => {
  try {
    const newPayment = await createPayment(req.body);
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a payment
router.patch("/:id", async (req, res) => {
  try {
    await updatePayment(req.params.id, req.body);
    res.json({ message: "Payment updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a payment
router.delete("/:id", async (req, res) => {
  try {
    await deletePayment(req.params.id);
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
