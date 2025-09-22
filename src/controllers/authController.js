import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { generateOtp, otpExpiry } from "../utils/otp.js";
import { sendOtpMail } from "../utils/mailer.js";
import { createUser, findUserByEmail, verifyUser, updatePassword, deleteUser } from "../models/userModel.js";
import { createOtp, findValidOtp, deleteOtp } from "../models/otpModel.js";
import { createRefreshToken, findRefreshTokenByToken, deleteRefreshTokenByToken } from "../models/refreshTokenModel.js";
import { generateRefreshToken, refreshTokenExpiry } from "../utils/refreshToken.js";
const pepper = process.env.PEPPER;

// Signup
export async function signup(req, res) {
	const { email, username, password } = req.body;
	const existing = await findUserByEmail(email);
	if (existing) return res.status(400).json({ message: "User already exists" });

	const hash = await bcrypt.hash(password + pepper, 10);
	const user = await createUser(email, username, hash, "local");

	const otp = generateOtp();
	await createOtp(user.id, otp, "verify_email", otpExpiry());
	await sendOtpMail(email, otp, "verify_email");

	res.json({ message: "Signup successful. Please verify your email." });
}

// Verify email
export async function verifyEmail(req, res) {
	const { email, otp } = req.body;
	const user = await findUserByEmail(email);
	if (!user) return res.status(400).json({ message: "Invalid user" });

	const otpRecord = await findValidOtp(user.id, otp, "verify_email");
	if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

	await verifyUser(user.id);
	await deleteOtp(user.id, "verify_email");

	res.json({ message: "Email verified successfully" });
}

// Login
export async function loginSuccess(req, res) {
	const accessToken = generateToken({ id: req.user.id, email: req.user.email });
	const refreshToken = generateRefreshToken();

	await createRefreshToken(req.user.id, refreshToken, refreshTokenExpiry());

	// Send refresh token in HttpOnly cookie
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production", // only https in prod
		sameSite: "none",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	res.json({ accessToken: accessToken });
}

// Forgot password
export async function forgotPassword(req, res) {
	const { email } = req.body;
	const user = await findUserByEmail(email);
	if (!user) return res.status(400).json({ message: "User not found" });

	const otp = generateOtp();
	await createOtp(user.id, otp, "reset_password", otpExpiry());
	await sendOtpMail(email, otp, "reset_password");

	res.json({ message: "OTP sent for password reset" });
}

// Reset password
export async function resetPassword(req, res) {
	const { email, otp, newPassword } = req.body;
	const user = await findUserByEmail(email);
	if (!user) return res.status(400).json({ message: "Invalid user" });

	const otpRecord = await findValidOtp(user.id, otp, "reset_password");
	if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

	const hash = await bcrypt.hash(newPassword + pepper, 10);
	await updatePassword(user.id, hash);
	await deleteOtp(user.id, "reset_password");

	res.json({ message: "Password reset successful" });
}

//Change password
export async function changePassword(req, res) {
	const { oldPassword, newPassword } = req.body;

	// req.user comes from JWT (authMiddleware)
	const user = await findUserByEmail(req.user.email);
	if (!user) return res.status(404).json({ message: "User not found" });

	// Compare old password
	const isMatch = await bcrypt.compare(oldPassword + pepper, user.password_hash);
	if (!isMatch) {
		return res.status(400).json({ message: "Old password is incorrect" });
	}

    // Check if new password is same as old
    if(oldPassword === newPassword) return res.status(400).json({ message: "New password must be different from old password" });

	// Hash new password
	const hash = await bcrypt.hash(newPassword + pepper, 10);
	await updatePassword(user.id, hash);

	res.json({ message: "Password updated successfully" });
}

// Generate new access token from refresh token
export async function refreshToken(req, res) {
	const refreshToken = req.cookies.refreshToken; // extract from cookie
	if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

	const stored = await findRefreshTokenByToken(refreshToken);
    if (!stored) return res.status(403).json({ message: 'Invalid or expired refresh token' });

	const accessToken = generateToken({ id: stored.user_id, email: stored.email });
	res.json({ accessToken });
}

// Logout
export async function logout(req, res) {
	const refreshToken = req.cookies.refreshToken;
	if (refreshToken) {
		await deleteRefreshTokenByToken(refreshToken);
		res.clearCookie("refreshToken");
	}
	res.json({ message: "Logged out successfully" });
}

// Delete User
export async function deleteAccount(req, res) {
    const { password } = req.body;

    // req.user comes from JWT (authMiddleware)
	const user = await findUserByEmail(req.user.email);
	if (!user) return res.status(404).json({ message: "User not found" });

	// Compare password
	const isMatch = await bcrypt.compare(password + pepper, user.password_hash);
	if (!isMatch) {
		return res.status(401).json({ message: "Password is incorrect" });
	}

	const userId = req.user.id; // from JWT
	await deleteUser(userId); //with cascade everything will be deleted
	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "none",
	});
	res.json({ message: "Account deleted successfully" });
}
