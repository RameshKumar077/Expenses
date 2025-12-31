import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url"; // Required to define __dirname in ES modules

// Import Routes
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expense.js";

// --- FIX START: Define __dirname for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- FIX END ---

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected ✔"))
    .catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/expenses", expenseRoutes);

// --- FIX START: Handle Root and Favicon Errors ---
// 1. Serve a simple message for the root URL
app.get("/", (req, res) => {
    res.send("API is running successfully. Use /api/v1/... endpoints.");
});

// 2. (Optional) If you have a 'public' folder in server, serve it to fix missing images/icons
// app.use(express.static(path.join(__dirname, 'public'))); 
// --- FIX END ---

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));