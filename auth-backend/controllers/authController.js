import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mailServices.js";

// ====================== REGISTER ===========================
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already exists." });

        const hashed = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashed,
            role: role || "user"
        });

        res.json({ message: "User registered successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ========================= LOGIN ===========================
export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "5h" }
    );

    return res.status(200).json({
        message: "Login Successful",
        id: user._id,
        name: user.name,
        email: user.email,
        token,
    });
};

// ==================== FORGOT PASSWORD =======================
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email || email.trim() === "") {
        return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user)
        return res.status(404).json({ error: "This email is not registered. Please sign up first." });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Send OTP email
    await sendEmail(
        user.email,
        "Your Password Reset OTP",
        `<div style="font-family: Arial; padding: 20px;">
            <h2>Your OTP Code</h2>
            <p>Your OTP for password reset is:</p>
            <h1 style="color: #4F46E5;">${otp}</h1>
            <p>This OTP is valid for <b>5 minutes</b>.</p>
        </div>`
    );

    return res.json({ message: "OTP has been sent to your registered email." });
};

// ===================== VERIFY OTP ============================
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.otp !== otp)
            return res.status(400).json({ error: "Invalid OTP" });

        if (user.otpExpires < Date.now())
            return res.status(400).json({ error: "OTP has expired" });

        return res.json({ message: "OTP verified successfully" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ====================== RESET PASSWORD =======================
export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user)
        return res.status(400).json({ error: "User not found with this email." });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ message: "Password successfully reset. Please login again!" });
};

// ========================= LOGOUT =============================
export const logout = async (req, res) => {
    try {
        return res.json({ message: "Logged out successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Logout Failed!" });
    }
};

// ===================== CHANGE PASSWORD ========================
export const changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({
                error: "Email, old password, and new password are required."
            });
        }

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ error: "No account found with this email." });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Old password is incorrect" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.json({ message: "Password updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
