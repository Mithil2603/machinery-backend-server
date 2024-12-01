import pool from "../db_connect.js";

// Get all payments
export async function getPayments() {
  const [rows] = await pool.query("SELECT * FROM payment_tbl");
  return rows;
}

// Get a single payment by ID
export async function getPayment(id) {
  const [rows] = await pool.query(
    "SELECT * FROM payment_tbl WHERE payment_id = ?",
    [id]
  );
  return rows[0];
}

// Create a new payment
export async function createPayment(payment) {
  const {
    order_id,
    payment_amount,
    payment_method,
    bill,
    payment_status,
    installment_number,
    payment_type,
  } = payment;
  const [result] = await pool.query(
    "INSERT INTO payment_tbl (order_id, payment_amount, payment_method, bill, payment_status, installment_number, payment_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      order_id,
      payment_amount,
      payment_method,
      bill,
      payment_status,
      installment_number,
      payment_type,
    ]
  );
  return { id: result.insertId };
}

// Update payment details
export async function updatePayment(id, payment) {
  const {
    order_id,
    payment_amount,
    payment_method,
    bill,
    payment_status,
    installment_number,
    payment_type,
  } = payment;

  await pool.query(
    `UPDATE payment_tbl 
       SET 
          order_id = ?, 
          payment_amount = ?, 
          payment_method = ?, 
          bill = ?, 
          payment_status = ?, 
          installment_number = ?, 
          payment_type = ? 
       WHERE payment_id = ?`,
    [
        order_id,
        payment_amount,
        payment_method,
        bill,
        payment_status,
        installment_number,
        payment_type,
        id,
    ]
  );

  return { message: "Payment updated successfully" };
}

// Delete a payment
export async function deletePayment(id) {
  const [result] = await pool.query(
    "DELETE FROM payment_tbl WHERE payment_id = ?",
    [id]
  );
  if (result.affectedRows === 0) {
    return { message: "No payment found with the given ID" };
  }
  return { message: "payment deleted successfully" };
}
