const ExpressError = require("../utils/ExpressError.js"); // custom error class for Express
const { signupSchema, verifySchema, loginSchema, forgetPasswordSchema, resetPasswordSchema, changePasswordSchema, refreshTokenSchema, logoutSchema } = require("../utils/joiSchema.js"); // importing the Joi schema for validation

module.exports.validateUserSignup = (req, res, next) => {
	let { error } = signupSchema.validate(req.body);
	if (error) {
		// If validation fails, throw an error
		throw new ExpressError(400, error);
	} else {
		next();
	}
};

module.exports.validateVerifyEmail = (req, res, next) => {
    let { error } = verifySchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

module.exports.validateUserLogin = (req, res, next) => {
    let { error } = loginSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

module.exports.validateForgetPassword = (req, res, next) => {
    let { error } = forgetPasswordSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

module.exports.validateResetPassword = (req, res, next) => {
    let { error } = resetPasswordSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

module.exports.validateChangePassword = (req, res, next) => {
    let { error } = changePasswordSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

module.exports.validateRefreshToken = (req, res, next) => {
    let { error } = refreshTokenSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

module.exports.validateLogout = (req, res, next) => {
    let { error } = logoutSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error);
    } else {
        next();
    }
};
