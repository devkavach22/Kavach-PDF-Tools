import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();

const app = express();

const MONGO_URL = process.env.MONGO_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

const allowedOrigins = [
    "http://localhost:8080",           // Local fronten          // Production frontend (domain)
];

app.use(cors({
    // origin: allowedOrigins,
    origin: "*",
    credentials: true
}));

// app.options("*")
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/pdf",pdfRoutes);

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Server running on ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});