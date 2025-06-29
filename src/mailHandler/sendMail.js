import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOTPmail = async (email, otp, type) => {
  const mailFormat = {
    from: process.env.MAIL_USER,
    to: email,
    subject:
      type === "VERIFY"
        ? "Verify your email address - ChtrHub"
        : "Reset your password - ChtrHub",
    html: `<p>Your OTP is <strong>${otp}</strong></p>
    <h6> This OTP is valid only for 5 minutes.</h6>`,
  };

  try {
    await transporter.sendMail(mailFormat);
    console.log("✅ Email sent to", email);
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
};
