import express from "express";
import {
    getServices,
    getService,
    createService,
    updateService,
    deleteService,
} from "../models/services.js";

const router = express.Router(); 

// Get all services
router.get("/", async (req, res) => {
  try {
    const service = await getServices();
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a service by ID
router.get("/:id", async (req, res) => {
  try {
    const service = await getService(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new service
router.post("/", async (req, res) => {
  try {
    const newService = await createService(req.body);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a service
router.patch("/:id", async (req, res) => {
  try {
    await updateService(req.params.id, req.body);
    res.json({ message: "Service updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a delivery
router.delete("/:id", async (req, res) => {
  try {
    await deleteService(req.params.id);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
