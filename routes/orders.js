import express from "express";
import {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
} from "../models/orders.js";

const router = express.Router(); 

// Get all Orders
router.get("/", async (req, res) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new order
router.post("/", async (req, res) => {
  try {
    const newOrder = await createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a order
router.patch("/:id", async (req, res) => {
  try {
    await updateOrder(req.params.id, req.body);
    res.json({ message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a order
router.delete("/:id", async (req, res) => {
  try {
    await deleteOrder(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
