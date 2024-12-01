import pool from "../db_connect.js";

// Get all Services
export async function getServices() {
  const [rows] = await pool.query("SELECT * FROM service_tbl");
  return rows;
}

// Get a single service by ID
export async function getService(id) {
  const [rows] = await pool.query(
    "SELECT * FROM service_tbl WHERE service_id = ?",
    [id]
  );
  return rows[0];
}

// Create a new service
export async function createService(service) {
  const {
    order_id,
    user_id,
    payment_id,
    service_type,
    service_notes,
    service_cost,
    service_status,
  } = service;
  const [result] = await pool.query(
    "INSERT INTO service_tbl (order_id, user_id, payment_id, service_type, service_notes, service_cost, service_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      order_id,
      user_id,
      payment_id,
      service_type,
      service_notes,
      service_cost,
      service_status,
    ]
  );
  return { id: result.insertId };
}

// Update service details
export async function updateService(id, service) {
  const {
    order_id,
    user_id,
    payment_id,
    service_type,
    service_notes,
    service_cost,
    service_status,
  } = service;

  await pool.query(
    `UPDATE service_tbl 
       SET 
          order_id = ?, 
          user_id = ?,
          payment_id = ?,
          service_type = ?,
          service_notes = ?,
          service_cost = ?,
          service_status = ?
       WHERE service_id = ?`,
    [
      order_id,
      user_id,
      payment_id,
      service_type,
      service_notes,
      service_cost,
      service_status,
      id,
    ]
  );

  return { message: "Service updated successfully" };
}

// Delete a service
export async function deleteService(id) {
  const [result] = await pool.query(
    "DELETE FROM service_tbl WHERE service_id = ?",
    [id]
  );
  if (result.affectedRows === 0) {
    return { message: "No services found with the given ID" };
  }
  return { message: "Service deleted successfully" };
}
