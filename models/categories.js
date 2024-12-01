import pool from "../db_connect.js";

// Get all Categories
export async function getCategories() {
  const [rows] = await pool.query("SELECT * FROM category_tbl");
  return rows;
}

// Get a single Category by ID
export async function getCategory(id) {
  const [rows] = await pool.query(
    "SELECT * FROM category_tbl WHERE category_id = ?",
    [id]
  );
  return rows[0];
}

// Create a new Category
export async function createCategory(category) {
  const { category_name, category_description } = category;
  const [result] = await pool.query(
    "INSERT INTO category_tbl (category_name, category_description) VALUES (?, ?)",
    [category_name, category_description]
  );
  return { id: result.insertId };
}

// Update Category
export async function updateCategory(id, category) {
  const { category_name, category_description } = category;
  await pool.query(
    `UPDATE category_tbl SET category_name = ?, category_description = ? WHERE category_id = ?`, [category_name, category_description, id]
  );
  return { message: "Category updated successfully" };
}

// Delete a Category
export async function deleteCategory(id) {
  const [result] = await pool.query(
    "DELETE FROM category_tbl WHERE category_id = ?",
    [id]
  );
  if (result.affectedRows === 0) {
    return { message: "No category found with the given ID" };
  }
  return { message: "Category deleted successfully" };
}
