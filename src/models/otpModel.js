import pool from '../config/db.js';

export async function createOtp(userId, otpCode, purpose, expiresAt) {
  await pool.query(
    `INSERT INTO otp_codes (user_id, otp_code, purpose, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [userId, otpCode, purpose, expiresAt]
  );
}

export async function findValidOtp(userId, otpCode, purpose) {
  const result = await pool.query(
    `SELECT * FROM otp_codes
     WHERE user_id = $1 AND otp_code = $2 AND purpose = $3
     AND expires_at > NOW()`,
    [userId, otpCode, purpose]
  );
  return result.rows[0];
}

export async function deleteOtp(userId, purpose) {
  await pool.query('DELETE FROM otp_codes WHERE user_id = $1 AND purpose = $2', [userId, purpose]);
}
