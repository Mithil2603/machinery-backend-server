import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../models/categories.js";

const router = express.Router();

// Get all Categories
router.get("/", async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a Category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await getCategory(req.params.id);
    if (!category) return res.status(404).json({ error: "category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new Category
router.post("/", async (req, res) => {
    try{
        const newCategory = await createCategory(req.body);
        res.status(201).json(newCategory);
    }
    catch(error) {
        res.status(500).json({ error: error.message });
    }
})

// Update the Category
router.patch("/:id", async (req, res) => {
    try{
        await updateCategory(req.params.id, req.body);
        res.json({ message: "Category Updated Successfully!" });
    }
    catch(error) {
        res.status(500).json({ error: error.message });
    }
})

// Delete a Category
router.delete("/:id", async (req, res) => {
    try{
        await deleteCategory(req.params.id);
        res.json({ message: "Category Deleted Successfully!" });
    }
    catch(error) {
        res.status(500).json({ message: error.message });
    }
})

export default router;
