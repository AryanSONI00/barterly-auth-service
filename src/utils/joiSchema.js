//schema validation using Joi, validates the data before it is sent to the database, reducing db lookups
const Joi = require("joi");

module.exports.signupSchema = Joi.object({
	username: Joi.string().pattern(/^[a-zA-Z0-9_]+$/).min(3).max(30).required(),
	email: Joi.string().min(5).max(100).email().required(),
	password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/).min(8).max(100).required(),
}).required();

module.exports.verifySchema = Joi.object({
	email: Joi.string().min(5).max(100).email().required(),
	otp: Joi.string().pattern(/^[0-9]{6}$/).min(6).max(6).required(),
}).required();

module.exports.loginSchema = Joi.object({
	email: Joi.string().min(5).max(100).email().required(),
	password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/).min(8).max(100).required(),
}).required();

module.exports.forgetPasswordSchema = Joi.object({
	email: Joi.string().min(5).max(100).email().required(),
}).required();

module.exports.resetPasswordSchema = Joi.object({
	email: Joi.string().min(5).max(100).email().required(),
    otp: Joi.string().pattern(/^[0-9]{6}$/).min(6).max(6).required(),
    newPassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/).min(8).max(100).required(),
}).required();

module.exports.changePasswordSchema = Joi.object({
	oldPassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/).min(8).max(100).required(),
	newPassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/).min(8).max(100).required(),
}).required();

module.exports.refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
}).required();

module.exports.logoutSchema = Joi.object({
    refreshToken: Joi.string().required(),
}).required();
