require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { verifyTokenMiddleware } = require("./middlewares/verifyToken");
const { publishUserCreatedEvent } = require("./utils/eventbridge");
const app = express();

app.use(express.json());
app.use(morgan("dev"));

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/v1/auth/public", (req, res) => res.json({ msg: "auth public endpoint" }));

app.get("/api/v1/auth/me", verifyTokenMiddleware, async (req, res) => {
	const user = req.user || {};
	res.json({
		sub: user.sub,
		email: user.email,
		username: user["cognito:username"] || user["cognito:preferred_username"] || user.username,
		groups: user["cognito:groups"] || [],
	});
});

// internal endpoint to publish post-confirmation event (used by infra hook or admin)
app.post("/api/v1/auth/publish-user-created", async (req, res) => {
	const { userId, email, username } = req.body;
	if (!userId) return res.status(400).json({ error: "userId required" });
	try {
		await publishUserCreatedEvent({ userId, email, username });
		return res.json({ ok: true });
	} catch (err) {
		console.error("publish error", err);
		return res.status(500).json({ error: "failed to publish" });
	}
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`barterly-auth-service listening on ${PORT}`));
