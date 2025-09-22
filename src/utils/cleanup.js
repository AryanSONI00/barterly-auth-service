import cron from "node-cron";
import pool from "../config/db.js";

async function deleteUnverifiedUsers() {
	try {
		const { rowCount } = await pool.query(`
      DELETE FROM users
      WHERE is_verified = false
      AND created_at < NOW() - INTERVAL '24 hours'
    `);
		console.log(`[cleanup] Deleted ${rowCount} unverified users`);
		return rowCount;
	} catch (error) {
		console.error(`[cleanup] Error deleting unverified users:`, error);
		throw error;
	}
}

async function deleteExpiredTokens() {
	try {
		const { rowCount } = await pool.query(`
      DELETE FROM refresh_tokens
      WHERE expires_at < NOW()
    `);
		console.log(`[cleanup] Deleted ${rowCount} expired refresh tokens`);
		return rowCount;
	} catch (error) {
		console.error(`[cleanup] Error deleting expired refresh tokens:`, error);
		throw error;
	}
}

async function deleteExpiredOtps() {
	try {
		const { rowCount } = await pool.query(`
      DELETE FROM otp_codes
      WHERE expires_at < NOW()
    `);
		console.log(`[cleanup] Deleted ${rowCount} expired OTP codes`);
		return rowCount;
	} catch (error) {
		console.error(`[cleanup] Error deleting expired OTP codes:`, error);
		throw error;
	}
}

// Run every 2 min to test "*/2 * * * *"
// Run daily at 3 AM "0 3 * * *"
cron.schedule("0 3 * * *", async () => {
	console.log(`[cleanup] Job started at ${new Date().toISOString()}`);
	try {
		const usersDeleted = await deleteUnverifiedUsers();
		const tokensDeleted = await deleteExpiredTokens();
		const otpsDeleted = await deleteExpiredOtps();

		console.log(`[cleanup] Finished. Users: ${usersDeleted}, Tokens: ${tokensDeleted}, OTPs: ${otpsDeleted}`);
	} catch (error) {
		console.error(`[cleanup] Job failed:`, error);
	}
});
