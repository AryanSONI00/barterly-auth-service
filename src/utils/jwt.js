import jwt from "jsonwebtoken";
import ExpressError from "./ExpressError.js";

export function generateToken(payload) {
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token) {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (err) {
		throw new ExpressError(401, "Invalid or expired token");
	}
}
