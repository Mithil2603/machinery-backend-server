import pool from "../db_connect.js";

// Get all feedbacks with user's first and last name
export async function getFeedbacks() {
  const [rows] = await pool.query(`
    SELECT feedback_tbl.*, user_tbl.first_name, user_tbl.last_name
    FROM feedback_tbl
    JOIN user_tbl ON feedback_tbl.user_id = user_tbl.user_id
  `);
  return rows;
}

// Get a single feedback by ID with user's first and last name
export async function getFeedback(id) {
  const [rows] = await pool.query(
    `
      SELECT feedback_tbl.*, user_tbl.first_name, user_tbl.last_name
      FROM feedback_tbl
      JOIN user_tbl ON feedback_tbl.user_id = user_tbl.user_id
      WHERE feedback_tbl.feedback_id = ?
    `,
    [id]
  );
  return rows[0];
}

// Create a new feedback
export async function createFeedback(feedback) {
  const { user_id, product_id, service_id, comment, rating } = feedback;
  const [result] = await pool.query(
    "INSERT INTO feedback_tbl (user_id, product_id, service_id, comment, rating) VALUES (?, ?, ?, ?, ?)",
    [user_id, product_id, service_id, comment, rating]
  );
  return { id: result.insertId };
}

// Update feedback details
export async function updateFeedback(id, feedback) {
  const { user_id, product_id, service_id, comment, rating } = feedback;

  await pool.query(
    `UPDATE feedback_tbl 
       SET 
          user_id = ?,
          product_id = ?,
          service_id = ?,
          comment = ?,
          rating = ?
       WHERE feedback_id = ?`,
    [user_id, product_id, service_id, comment, rating, id]
  );

  return { message: "Feedback updated successfully" };
}

// Delete a feedback
export async function deleteFeedback(id) {
  const [result] = await pool.query(
    "DELETE FROM feedback_tbl WHERE feedback_id = ?",
    [id]
  );
  if (result.affectedRows === 0) {
    return { message: "No feedback found with the given ID" };
  }
  return { message: "Feedback deleted successfully" };
}