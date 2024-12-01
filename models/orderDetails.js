import pool from "../db_connect.js";

// Get order details
export async function getOrderDetails() {
  const [rows] = await pool.query("SELECT * FROM order_details_tbl");
  return rows;
}

// Get a single order details by ID
export async function getOrderDetail(id) {
  const [rows] = await pool.query(
    "SELECT * FROM order_details_tbl WHERE order_details_id = ?",
    [id]
  );
  return rows[0];
}

// Add a new order details
export async function createOrderDetail(order) {
  const {
    order_id,
    product_id,
    quantity,
    no_of_ends,
    creel_type,
    creel_pitch,
    bobin_length,
  } = order;
  const [result] = await pool.query(
    "INSERT INTO order_details_tbl (order_id, product_id, quantity, no_of_ends, creel_type, creel_pitch, bobin_length) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      order_id,
      product_id,
      quantity,
      no_of_ends,
      creel_type,
      creel_pitch,
      bobin_length,
    ]
  );
  return { id: result.insertId };
}

// Update OrderDetails detail
export async function updateOrderDetails(id, order) {
  const {
    order_id,
    product_id,
    quantity,
    no_of_ends,
    creel_type,
    creel_pitch,
    bobin_length,
  } = order;

  await pool.query(
    `UPDATE order_details_tbl 
       SET 
          order_id = ?, 
          product_id = ?, 
          quantity = ?, 
          no_of_ends = ?, 
          creel_type = ?, 
          creel_pitch = ?, 
          bobin_length = ?
       WHERE order_details_id = ?`,
    [
      order_id,
      product_id,
      quantity,
      no_of_ends,
      creel_type,
      creel_pitch,
      bobin_length,
      id,
    ]
  );

  return { message: "Order Details updated successfully" };
}

// Delete a order details detail
export async function deleteOrderDetails(id) {
  const [result] = await pool.query(
    "DELETE FROM order_details_tbl WHERE order_details_id = ?",
    [id]
  );
  if (result.affectedRows === 0) {
    return { message: "No order details found with the given ID" };
  }
  return { message: "Order Details deleted successfully" };
}
