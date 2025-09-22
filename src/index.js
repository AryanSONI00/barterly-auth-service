import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();

import cookieParser from "cookie-parser";

import passport from "./config/passport.js";
import authRouter from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import ExpressError from "./utils/ExpressError.js";
import pool from "./config/db.js";
import "./utils/cleanup.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());

// routes
app.get("/api/v1/auth/health", (req, res) => {
	res.json({ status: "ok" });
});
app.use("/api/v1/auth", authRouter);

// if no above route matches, this middleware will be called
app.all(/.*/, (req, res, next) => {
	next(new ExpressError(404, "Page Not Found"));
});

app.use(errorHandler); // Custom error handling middleware that will handle all errors

// start server only after connecting to DB
const PORT = process.env.PORT || 3001;
async function startServer() {
	try {
		// Check DB connectivity before boot
		await pool.query("SELECT 1");
		console.log("Connected to PostgreSQL");

		// Only now start server
		app.listen(PORT, () => {
			console.log(`Auth service running on port ${PORT}`);
		});
	} catch (err) {
		console.error("Database not reachable:", err);
		process.exit(1); // stop process
	}
}
startServer();
