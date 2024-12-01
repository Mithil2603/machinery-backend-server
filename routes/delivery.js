import express from "express";
import {
    getAllDelivery,
    getDelivery,
    createDelivery,
    updateDelivery,
    deleteDelivery,
} from "../models/delivery.js";

const router = express.Router(); 

// Get all delivery
router.get("/", async (req, res) => {
  try {
    const delivery = await getAllDelivery();
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a delivery by ID
router.get("/:id", async (req, res) => {
  try {
    const delivery = await getDelivery(req.params.id);
    if (!delivery) return res.status(404).json({ error: "Delivery not found" });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new delivery
router.post("/", async (req, res) => {
  try {
    const newDelivery = await createDelivery(req.body);
    res.status(201).json(newDelivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a delivery
router.patch("/:id", async (req, res) => {
  try {
    await updateDelivery(req.params.id, req.body);
    res.json({ message: "Delivery updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a delivery
router.delete("/:id", async (req, res) => {
  try {
    await deleteDelivery(req.params.id);
    res.json({ message: "Delivery deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
