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
        origin: ["http://localhost:5173",                      // Local Frontend
            "http://localhost:5000",                      // Local Backend (testing)
            "https://expenses-frontend-git-main-ramesh-kumars-projects-bd92c359.vercel.app/login"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// Routes
// Define routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/expenses", expenseRoutes);
//app.use("/api/v1/gemini", geminiRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// --- CHANGE START: Vercel Configuration ---
const PORT1 = process.env.PORT || 5000;

// Only listen if NOT running on Vercel (local development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT1, () => console.log(`Server running on port ${PORT1}`));
}

// Export the app for Vercel
export default app;
// --- CHANGE END ---