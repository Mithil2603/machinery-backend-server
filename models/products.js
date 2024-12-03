import pool from "../db_connect.js";

// Get all products
export async function getProducts() {
  const [rows] = await pool.query("SELECT * FROM product_tbl");
  return rows;
}

// Get a single product by ID
export async function getProduct(id) {
  const [rows] = await pool.query(
    "SELECT * FROM product_tbl WHERE product_id = ?",
    [id]
  );
  return rows[0];
}

// Create a new product
export async function createProduct(product) {
  const { category_id, product_name, product_description, product_img } = product;

  // Serialize product_description to JSON
  const serializedDescription = JSON.stringify(product_description);

  const [result] = await pool.query(
    "INSERT INTO product_tbl (category_id, product_name, product_description, product_img) VALUES (?, ?, ?, ?)",
    [category_id, product_name, serializedDescription, product_img]
  );
  return { id: result.insertId };
}

// Update product details
export async function updateProduct(id, product) {
  const { category_id, product_name, product_description, product_img } = product;

  // Serialize product_description to JSON
  const serializedDescription = JSON.stringify(product_description);

  await pool.query(
    `UPDATE product_tbl 
       SET 
          category_id = ?, 
          product_name = ?, 
          product_description = ?,
          product_img = ?
       WHERE product_id = ?`,
    [category_id, product_name, serializedDescription, product_img, id]
  );

  return { message: "Product updated successfully" };
}

// Delete a product
export async function deleteProduct(id) {
  const [result] = await pool.query(
    "DELETE FROM product_tbl WHERE product_id = ?",
    [id]
  );
  if (result.affectedRows === 0) {
    return { message: "No product found with the given ID" };
  }
  return { message: "Product deleted successfully" };
}
