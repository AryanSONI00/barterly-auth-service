import ExpressError from "../utils/ExpressError.js"; // custom error class for Express
import { signupSchema, verifySchema, loginSchema, forgetPasswordSchema, resetPasswordSchema, changePasswordSchema, refreshTokenSchema, logoutSchema, deleteSchema } from "../utils/joiSchema.js"; // importing the Joi schema for validation

export function validateUserSignup (req, res, next) {
	let { error } = signupSchema.validate(req.body);
	if (error) {
		// If validation fails, throw an error
		throw new ExpressError(400, error.message);
	} else {
		next();
	}
};

export function validateVerifyEmail (req, res, next) {
    let { error } = verifySchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error.message);
    } else {
        next();
    }
};

export function validateUserLogin (req, res, next) {
    let { error } = loginSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error.message);
    } else {
        next();
    }
};

export function validateForgetPassword (req, res, next) {
    let { error } = forgetPasswordSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error.message);
    } else {
        next();
    }
};

export function validateResetPassword (req, res, next) {
    let { error } = resetPasswordSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error.message);
    } else {
        next();
    }
};

export function validateChangePassword (req, res, next) {
    let { error } = changePasswordSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error.message);
    } else {
        next();
    }
};

export function validateRefreshToken (req, res, next) {
    let { error } = refreshTokenSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error.message);
    } else {
        next();
    }
};

export function validateLogout (req, res, next) {
    let { error } = logoutSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error.message);
    } else {
        next();
    }
};

export function validateDeleteAccount (req, res, next) {
    let { error } = deleteSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error.message);
    } else {
        next();
    }
};
