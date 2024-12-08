import pool from "../db_connect.js";
import bcrypt from "bcrypt";

// Save a new user to the database
export async function saveUser(user) {
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
        `INSERT INTO user_tbl 
        (user_type, first_name, last_name, phone_number, email, company_name, 
        company_address, address_city, address_state, address_country, GST_no, user_password) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    return { id: result.insertId, ...user };
}

// Save reset token
export async function saveResetToken(email, token) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await pool.query(
        `UPDATE user_tbl SET reset_token = ?, reset_token_expires = ? WHERE email = ?`,
        [token, expiresAt, email]
    );
}

// Validate reset token
export async function validateResetToken(token) {
    const [rows] = await pool.query(
        `SELECT email FROM user_tbl WHERE reset_token = ? AND reset_token_expires > NOW()`,
        [token]
    );
    return rows.length ? rows[0].email : null;
}

// Update user password
export async function updatePassword(email, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
        `UPDATE user_tbl SET user_password = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?`,
        [hashedPassword, email]
    );
}

// Save email verification token
export async function saveEmailVerificationToken(email, token) {
    await pool.query(`UPDATE user_tbl SET email_verification_token = ? WHERE email = ?`, [
        token,
        email,
    ]);
}

// Verify email token
export async function verifyEmailToken(token) {
    const [rows] = await pool.query(
        `SELECT email FROM user_tbl WHERE email_verification_token = ?`,
        [token]
    );
    if (rows.length) {
        await pool.query(`UPDATE user_tbl SET email_verified = 1, email_verification_token = NULL WHERE email = ?`, [
            rows[0].email,
        ]);
        return rows[0].email;
    }
    return null;
}

export async function findUserByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM user_tbl WHERE email = ?", [email]);
    return rows[0];
}