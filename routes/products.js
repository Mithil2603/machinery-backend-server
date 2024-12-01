import express from "express";
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../models/products.js";

const router = express.Router(); 

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await getProduct(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  try {
    const newProduct = await createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a product
router.patch("/:id", async (req, res) => {
  try {
    await updateProduct(req.params.id, req.body);
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
