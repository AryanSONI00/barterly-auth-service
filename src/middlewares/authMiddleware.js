import { verifyToken } from "../utils/jwt.js";

export function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

	if (!token) {
		return next(new ExpressError("Authorization token missing", 401));
	}

	try {
		const payload = verifyToken(token);
		req.user = payload; // attach decoded payload to request
		next();
	} catch (err) {
		next(err); // forward ExpressError to global handler
	}
}
