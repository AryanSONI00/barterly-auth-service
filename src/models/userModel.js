import pool from '../config/db.js';

export async function createUser(email, username, passwordHash, provider, googleId = null) {
  const result = await pool.query(
    `INSERT INTO users (email, username, password_hash, provider, google_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [email, username, passwordHash, provider, googleId]
  );
  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

export async function findUserByUsername(username) {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
}

export async function findUserByGoogleId(googleId) {
  const result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
  return result.rows[0];
}

export async function verifyUser(userId) {
  await pool.query('UPDATE users SET is_verified = TRUE WHERE id = $1', [userId]);
}

export async function updatePassword(userId, newPasswordHash) {
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, userId]);
}
