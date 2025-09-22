import express from 'express';
const router = express.Router();
import passport from 'passport';
import wrapAsync from '../utils/wrapAsync.js';
import { validateUserSignup, validateVerifyEmail, validateUserLogin, validateForgetPassword, validateResetPassword, validateChangePassword, validateLogout, validateDeleteAccount } from '../middlewares/validationMiddleware.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { signup, verifyEmail, loginSuccess, forgotPassword, resetPassword, changePassword, refreshToken, logout, deleteAccount } from '../controllers/authController.js';

router.post('/signup', validateUserSignup, wrapAsync(signup));
router.post('/verify-email', validateVerifyEmail, wrapAsync(verifyEmail));

router.post('/login', validateUserLogin, passport.authenticate('local', { session: false, failWithError: true }), wrapAsync(loginSuccess));
router.post('/logout', wrapAsync(logout));

router.post('/forgot-password', validateForgetPassword, wrapAsync(forgotPassword));
router.post('/reset-password', validateResetPassword, wrapAsync(resetPassword));
router.post('/change-password', authenticateToken, validateChangePassword, wrapAsync(changePassword));

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failWithError: true }), wrapAsync(loginSuccess));

router.post('/refresh-token', wrapAsync(refreshToken));

router.delete('/delete-account', validateDeleteAccount, authenticateToken, wrapAsync(deleteAccount));

router.get('/me', authenticateToken, (req, res) => res.json({ userId: req.user.id, email: req.user.email }));

export default router;
