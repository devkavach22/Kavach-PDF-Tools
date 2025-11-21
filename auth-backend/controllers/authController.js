import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
// import { error } from "console";
// import { send } from "vite";

export const register = async(req, res)=>{
    try{
        const { name, email, password, role} = req.body;

        const existing = await User.findOne({email});
        if (existing) return res.status(400).json({ error: "Email already exists."});

        const hashed = await bcrypt.hash(password,10);

        await User.create({
            name, 
            email,
            password: hashed,
            role: role || "user"
        });

        res.json({message: "User registered successfully."});
    }
    catch (err)
    {
        res.status(500).json({error: err.message});
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});

    if (!user) return res.status(404).json({error: "User not found"});

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({error: "Invalid password"});

    const token = jwt.sign(
        { id: user._id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn:"5h"}
    );

    // res.cookie("token", token,{
    //     httpOnly:true,
    //     sameSite: "lax",
    //     secure: true,
    //     maxAge:5*60*60*1000,
    // });

    // res.json({
    //     message: "Login Successful",
    //     user: { name: user.name, role: user.role}
    // })
    return res.status(200).json({
        message: "Login Successful",
        id: user._id,
        name: user.name,
        email: user.email,
        token,
    });
}

export const forgotPassword = async (req,res) => {
    const {email} = req.body;

    if (!email || email.trim() === "")
    {
        return res.status(400).json({error:"Email is required"});
    }

    const user = await User.findOne({email});
    if (!user)
        return res.status(404).json({error: "This email is not registered with us" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
        await user.save();

        // Send OTP email
        await sendEmail(
            user.email,
            "Your Password Reset OTP",
            `<h3>Your OTP is <b>${otp}</b></h3><p>This OTP is valid for 5 minutes.</p>`
        );

        return res.json({ message: "OTP has been sent to your registered email." });

    // const token = crypto.randomBytes(32).toString("hex");

    // user.resetPasswordToken = token;
    // user.resetPasswordExpires = Date.now() + 10*60*1000;
    // await user.save();

    // const resetURL = `${process.env.CLIENT_URL}/reset-password`;

    // // await sendEmail(
    // //     user.email,
    // //     "Reset Your Password",
    // //     `
    // //         <p> Ypu resquested to reset your password.</p>
    // //         <p>Click the link below:</p>
    // //         <a href="${resetURL}">${resetURL}</a>
    // //         <p> This link is vaild for 10 minutes.</p>
    // //     `
    // // );

    // res.json({error: "Password reset email sent to registered email id."});
};

export const resetPassword = async ( req,res) => {
    // const {token} = req.params;
    const { email,newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user)
        return res.status(400).json({error: "User not found with this email."});

    user.password = await bcrypt.hash(newPassword,10);
    user.otp=undefined;
    user.otpExpires=undefined;
    // user.resetPasswordToken = undefined;
    // user.resetPasswordExpires = undefined;

    await user.save();

    res.json({message: "Password successfully reset. Please login again!"});
};

export const logout = async (req,res) => {
    try 
    {
        // res.clearCookie("token",{
        //     httpOnly:true,
        //     sameSite: "lax",
        //     secure: true,
        //     path: "/",
        // });

        return res.json({ message: "Logged out successfully" });
    }
    catch (err){
        return res.status(500).json({ error: "Logout Failed!" });
    }
};

export const changePassword = async (req,res) => {
    try
    {
        // const userId = req.user.id;
        const {email,oldPassword,newPassword} = req.body;

        if (!email || !oldPassword || !newPassword)
        {
            return res.status(400).json({
                error: "Email, old password and new password are rquired."
            });
        }

        const user = await User.findOne({email});
        if (!user)
            return res.status(404).json({error:"No account found with this email."});


        const isMatch = await bcrypt.compare(oldPassword,user.password);
        if (!isMatch)
            return res.status(400).json({error:"Old Password is incorrect"});

        user.password = await bcrypt.hash(newPassword,10);
        await user.save();

        return res.json({message:"Password updated successfully"});
    }
    catch (err)
    {
        return res.status(500).json({error:err.message});
    }
};

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