import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
    secure: true, // Use secure connection
    port: 465, // Port for secure connection
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

export async function sendOtpMail(to, otp, purpose) {
    const subject = purpose === "verify_email" ? "Verify your Barterly account" : "Reset your Barterly password";
    const text = `Your OTP for ${purpose.replace("_", " ")} is: ${otp}. It will expire in 10 minutes.`;

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: to,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP sent.");
    } catch (err) {
        console.error("❌ Error sending OTP:", err.message);
    }
}
