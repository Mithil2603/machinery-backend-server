import express from "express";
import {
    getOrderDetails,
    getOrderDetail,
    createOrderDetail,
    updateOrderDetails,
    deleteOrderDetails,
} from "../models/orderDetails.js";

const router = express.Router(); 

// Get all order details
router.get("/", async (req, res) => {
  try {
    const users = await getOrderDetails();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a order details by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await getOrderDetail(req.params.id);
    if (!order) return res.status(404).json({ error: "Order Details not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new order Details
router.post("/", async (req, res) => {
  try {
    const newOrderDetails = await createOrderDetail(req.body);
    res.status(201).json(newOrderDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a order details
router.patch("/:id", async (req, res) => {
  try {
    await updateOrderDetails(req.params.id, req.body);
    res.json({ message: "Order Details updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a order details
router.delete("/:id", async (req, res) => {
  try {
    await deleteOrderDetails(req.params.id);
    res.json({ message: "Order Details deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
