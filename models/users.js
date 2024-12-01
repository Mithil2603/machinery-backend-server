import pool from "../db_connect.js";

// Get all users
export async function getUsers() {
  const [rows] = await pool.query("SELECT * FROM user_tbl");
  return rows;
}

// Get a single user by ID
export async function getUser(id) {
  const [rows] = await pool.query("SELECT * FROM user_tbl WHERE user_id = ?", [
    id,
  ]);
  return rows[0];
}

// Create a new user
export async function createUser(user) {
  const {
    user_type,
    first_name,
    last_name,
    phone_number,
    email,
    company_name,
    company_address,
    address_city,
    address_state,
    address_country,
    GST_no,
    user_password,
  } = user;
  const [result] = await pool.query(
    "INSERT INTO user_tbl (user_type, first_name, last_name, phone_number, email, company_name, company_address, address_city, address_state, address_country, GST_no, user_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      user_type,
      first_name,
      last_name,
      phone_number,
      email,
      company_name,
      company_address,
      address_city,
      address_state,
      address_country,
      GST_no,
      user_password,
    ]
  );
  return { id: result.insertId };
}

// Update user details
export async function updateUser(id, user) {
  const {
    user_type,
    first_name,
    last_name,
    phone_number,
    email,
    company_name,
    company_address,
    address_city,
    address_state,
    address_country,
    GST_no,
    user_password,
  } = user;

  await pool.query(
    `UPDATE user_tbl 
       SET 
          user_type = ?, 
          first_name = ?, 
          last_name = ?, 
          phone_number = ?, 
          email = ?, 
          company_name = ?, 
          company_address = ?, 
          address_city = ?, 
          address_state = ?, 
          address_country = ?, 
          GST_no = ?, 
          user_password = ? 
       WHERE user_id = ?`,
    [
      user_type,
      first_name,
      last_name,
      phone_number,
      email,
      company_name,
      company_address,
      address_city,
      address_state,
      address_country,
      GST_no,
      user_password,
      id,
    ]
  );

  return { message: "User updated successfully" };
}

// Delete a user
export async function deleteUser(id) {
  const [result] = await pool.query("DELETE FROM user_tbl WHERE user_id = ?", [
    id,
  ]);
  if (result.affectedRows === 0) {
    return { message: "No user found with the given ID" };
  }
  return { message: "User deleted successfully" };
}
