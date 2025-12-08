// services/mailService.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { otpTemplate } from "../utils/sendEmail.js";

dotenv.config();

/*
  Required environment variables (.env):
  EMAIL_USER=your_email@gmail.com
  EMAIL_PASS=your_app_password       <-- Must be 16-character Gmail App Password
  EMAIL_PORT=587                     <-- Recommended for Render
  EMAIL_SECURE=false                 <-- false for port 587 (STARTTLS)
*/

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
  secure: process.env.EMAIL_SECURE === "true", // Convert string to boolean
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Helps avoid SSL issues on cloud hosting
  },
  logger: true, // Logs connection info
  debug: true,  // Shows SMTP traffic
});

/**
 * Send a generic email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${to}:`, info.response);
  } catch (error) {
    console.error("Email sending error:", error.stack || error);
    throw new Error("Failed to send email");
  }
};

/**
 * Send OTP email using prebuilt template
 * @param {string} email - Recipient email
 * @param {number|string} otp - Generated OTP
 */
export const sendOtpEmail = async (email, otp) => {
  try {
    const html = otpTemplate(otp, email);
    await sendEmail(email, "Your OTP for Password Reset", html);
  } catch (error) {
    console.error("OTP Email Error:", error.stack || error);
    throw error;
  }
};

/**
 * Simple test email for debugging
 */
export const sendTestEmail = async () => {
  try {
    await sendEmail(
      process.env.EMAIL_USER,
      "Test Email from Render",
      "<h1>Hello! This is a test email.</h1>"
    );
    console.log("Test email sent successfully!");
  } catch (error) {
    console.error("Test email failed:", error.stack || error);
  }
};
