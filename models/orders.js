import pool from "../db_connect.js";

// Get all Orders
export async function getOrders() {
  const [rows] = await pool.query("SELECT * FROM order_tbl");
  return rows;
}

// Get a single Order by ID
export async function getOrder(id) {
  const [rows] = await pool.query(
    "SELECT * FROM order_tbl WHERE order_id = ?",
    [id]
  );
  return rows[0];
}

// Create a new Order
export async function createOrder(order) {
  const { user_id, order_status } = order;
  const [result] = await pool.query(
    "INSERT INTO order_tbl (user_id, order_status) VALUES (?, ?)",
    [user_id, order_status]
  );
  return { id: result.insertId };
}

// Update Order details
export async function updateOrder(id, order) {
  const { user_id, order_status } = order;

  await pool.query(
    `UPDATE order_tbl 
       SET 
          user_id = ?, 
          order_status = ?
       WHERE order_id = ?`,
    [user_id, order_status, id]
  );

  return { message: "Order updated successfully" };
}

// Delete a Order
export async function deleteOrder(id) {
  const [result] = await pool.query(
    "DELETE FROM order_tbl WHERE order_id = ?",
    [id]
  );
  if (result.affectedRows === 0) {
    return { message: "No order found with the given ID" };
  }
  return { message: "Order deleted successfully" };
}
