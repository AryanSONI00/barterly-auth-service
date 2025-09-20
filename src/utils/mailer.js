import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendOtpMail(to, otp, purpose) {
  const subject = purpose === 'verify_email' ? 'Verify your Barterly account' : 'Reset your Barterly password';
  const text = `Your OTP for ${purpose.replace('_', ' ')} is: ${otp}. It will expire in 10 minutes.`;

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
  });
}
