import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();

const app = express();


app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/pdf",pdfRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT, () => 
        console.log(`Server running on port ${process.env.PORT}`)
    );
    })
    .catch(err => console.log(err));