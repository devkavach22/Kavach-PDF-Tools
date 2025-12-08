// services/mailService.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { otpTemplate } from "../utils/sendEmail.js";

dotenv.config();

/*
  Required environment variables (.env):

  EMAIL_USER=your_email@gmail.com
  EMAIL_PASS=your_app_password
*/

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use Gmail App Password only
  },
});

/**
 * Sends a generic email using Nodemailer
 * @param {string} to - recipient email
 * @param {string} subject - subject line
 * @param {string} html - HTML email body
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email sent to: ${to}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
};

/**
 * Sends OTP email using prebuilt HTML template
 * @param {string} email - receiver address
 * @param {number|string} otp - generated OTP
 */
export const sendOtpEmail = async (email, otp) => {
  try {
    const html = otpTemplate(otp, email);

    await sendEmail(email, "Your OTP for Password Reset", html);
  } catch (error) {
    console.error("OTP Email Error:", error);
    throw error;
  }
};
