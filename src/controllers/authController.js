import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import { generateOtp, otpExpiry } from '../utils/otp.js';
import { sendOtpMail } from '../utils/mailer.js';
import { createUser, findUserByEmail, verifyUser, updatePassword } from '../models/userModel.js';
import { createOtp, findValidOtp, deleteOtp } from '../models/otpModel.js';

// Signup
export async function signup(req, res) {
  const { email, username, password } = req.body;
  const existing = await findUserByEmail(email);
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hash = await bcrypt.hash(password, 10);
  const user = await createUser(email, username, hash, 'local');

  const otp = generateOtp();
  await createOtp(user.id, otp, 'verify_email', otpExpiry());
  await sendOtpMail(email, otp, 'verify_email');

  res.json({ message: 'Signup successful. Please verify your email.' });
}

// Verify email
export async function verifyEmail(req, res) {
  const { email, otp } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(400).json({ message: 'Invalid user' });

  const otpRecord = await findValidOtp(user.id, otp, 'verify_email');
  if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });

  await verifyUser(user.id);
  await deleteOtp(user.id, 'verify_email');

  res.json({ message: 'Email verified successfully' });
}

// Login (JWT handled in passport local strategy)
export async function loginSuccess(req, res) {
  const token = generateToken({ id: req.user.id, email: req.user.email });
  res.json({ token });
}

// Forgot password
export async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(400).json({ message: 'User not found' });

  const otp = generateOtp();
  await createOtp(user.id, otp, 'reset_password', otpExpiry());
  await sendOtpMail(email, otp, 'reset_password');

  res.json({ message: 'OTP sent for password reset' });
}

// Reset password
export async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(400).json({ message: 'Invalid user' });

  const otpRecord = await findValidOtp(user.id, otp, 'reset_password');
  if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });

  const hash = await bcrypt.hash(newPassword, 10);
  await updatePassword(user.id, hash);
  await deleteOtp(user.id, 'reset_password');

  res.json({ message: 'Password reset successful' });
}
