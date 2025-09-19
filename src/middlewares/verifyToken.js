const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa");

const REGION = process.env.AWS_REGION || "us-east-1";
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || "";
const APP_CLIENT_ID = process.env.COGNITO_APP_CLIENT_ID || "";

const JWKS_URI = process.env.COGNITO_JWKS_URI || `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;

const client = jwksRsa({
	jwksUri: JWKS_URI,
	cache: true,
	rateLimit: true,
});

function getKey(header, callback) {
	client.getSigningKey(header.kid, (err, key) => {
		if (err) return callback(err);
		const signingKey = key.getPublicKey();
		callback(null, signingKey);
	});
}

function verifyTokenMiddleware(req, res, next) {
	// Allow bypass if MOCK_JWKS=true (dev only). Danger: only for local dev.
	if (process.env.MOCK_JWKS === "true") {
		// naive mock: parse bearer token as base64 JSON for dev
		try {
			const auth = req.headers.authorization || "";
			const token = auth.split(" ")[1] || "";
			const decoded = token ? JSON.parse(Buffer.from(token, "base64").toString()) : { sub: "dev-sub", email: "dev@example.com" };
			req.user = decoded;
			return next();
		} catch (e) {
			return res.status(401).json({ error: "mock token invalid" });
		}
	}

	const auth = req.headers.authorization;
	if (!auth) return res.status(401).json({ error: "Authorization header missing" });
	const token = auth.split(" ")[1];
	if (!token) return res.status(401).json({ error: "Token missing" });

	jwt.verify(
		token,
		getKey,
		{
			audience: APP_CLIENT_ID,
			issuer: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
		},
		(err, decoded) => {
			if (err) {
				console.error("JWT verification failed", err);
				return res.status(401).json({ error: "Invalid token", details: err.message });
			}
			req.user = decoded;
			return next();
		}
	);
}

module.exports = { verifyTokenMiddleware };
