import crypto from 'crypto';

export function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
}

export function refreshTokenExpiry(days = 7) {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}
