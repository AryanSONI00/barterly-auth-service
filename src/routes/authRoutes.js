import express from 'express';
import passport from 'passport';
import { signup, verifyEmail, loginSuccess, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);

router.post('/login', passport.authenticate('local', { session: false }), loginSuccess);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  loginSuccess
);

export default router;
