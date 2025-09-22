import pool from '../config/db.js';

export async function createRefreshToken(userId, token, expiresAt) {
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, token, expiresAt]
  );
}

export async function findRefreshToken(userId, token) {
  const result = await pool.query(
    `SELECT * FROM refresh_tokens
     WHERE user_id = $1 AND token = $2 AND expires_at > NOW()`,
    [userId, token]
  );
  return result.rows[0];
}

export async function deleteRefreshToken(userId, token) {
  await pool.query(
    'DELETE FROM refresh_tokens WHERE user_id = $1 AND token = $2',
    [userId, token]
  );
}

export async function deleteAllRefreshTokens(userId) {
  await pool.query(
    'DELETE FROM refresh_tokens WHERE user_id = $1',
    [userId]
  );
}

// Find refresh token and join with users table to get email
export async function findRefreshTokenByToken(token) {
  const result = await pool.query(
    `SELECT rt.user_id, u.email
     FROM refresh_tokens rt
     JOIN users u ON rt.user_id = u.id
     WHERE rt.token = $1
     AND rt.expires_at > NOW()`,
    [token]
  );
  return result.rows[0]; // { user_id, email }
}

export async function deleteRefreshTokenByToken(token) {
  await pool.query(
    'DELETE FROM refresh_tokens WHERE token = $1',
    [token]
  );
}
