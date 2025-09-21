import dotenv from "dotenv";
dotenv.config();
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import { findUserByEmail, findUserByGoogleId, createUser } from '../models/userModel.js';
const pepper = process.env.PEPPER;

// Local strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
		const user = await findUserByEmail(email);
		if (!user || !user.is_verified) {
			return done(null, false, { message: "Invalid credentials or not verified" });
		}

		const match = await bcrypt.compare(password + pepper, user.password_hash);
		if (!match) {
			return done(null, false, { message: "Incorrect password" });
		}

		return done(null, user);
	} catch (err) {
		return done(err);
	}
}));

// Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
		let user = await findUserByGoogleId(profile.id);
		if (!user) {
			user = await createUser(profile.emails[0].value, profile.displayName, null, "google", profile.id);
		}
		return done(null, user);
	} catch (err) {
		return done(err);
	}
}));

export default passport;
