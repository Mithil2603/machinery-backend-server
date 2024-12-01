import pool from "../db_connect.js";

// Get all delivery
export async function getAllDelivery() {
  const [rows] = await pool.query("SELECT * FROM delivery_tbl");
  return rows;
}

// Get a single delivery by ID
export async function getDelivery(id) {
  const [rows] = await pool.query(
    "SELECT * FROM delivery_tbl WHERE delivery_id = ?",
    [id]
  );
  return rows[0];
}

// Create a new delivery
export async function createDelivery(delivery) {
  const { order_id, delivery_status } = delivery;
  const [result] = await pool.query(
    "INSERT INTO delivery_tbl (order_id, delivery_status) VALUES (?, ?)",
    [order_id, delivery_status]
  );
  return { id: result.insertId };
}

// Update delivery details
export async function updateDelivery(id, delivery) {
  const { order_id, delivery_status } = delivery;

  await pool.query(
    `UPDATE delivery_tbl 
       SET 
          order_id = ?, 
          delivery_status = ?
       WHERE delivery_id = ?`,
    [order_id, delivery_status, id]
  );

  return { message: "Delivery updated successfully" };
}

// Delete a Delivery
export async function deleteDelivery(id) {
  const [result] = await pool.query(
    "DELETE FROM delivery_tbl WHERE delivery_id = ?",
    [id]
  );
  if (result.affectedRows === 0) {
    return { message: "No Delivery found with the given ID" };
  }
  return { message: "Delivery deleted successfully" };
}
