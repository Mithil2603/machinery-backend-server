import pool from "../db_connect.js";
import bcrypt from "bcrypt";

// Utility: Hash password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Utility: Verify password
export async function verifyPassword(inputPassword, hashedPassword) {
  return bcrypt.compare(inputPassword, hashedPassword);
}

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
    user_type = "Customer", // Default role
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

  // Hash password
  const hashedPassword = await hashPassword(user_password);

  // Check if email already exists
  const [existingUser] = await pool.query("SELECT * FROM user_tbl WHERE email = ?", [email]);
  if (existingUser.length > 0) {
    throw new Error("Email is already registered");
  }

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
      hashedPassword,
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

  // Hash password only if provided
  let hashedPassword = user_password;
  if (user_password) {
    hashedPassword = await hashPassword(user_password);
  }

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
      hashedPassword,
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
