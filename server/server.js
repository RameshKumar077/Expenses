import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path"; // If you use path
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expense.js";
// ... other imports

const app = express();

// --- FIX START: Robust CORS Configuration ---
const allowedOrigins = [
    "https://expenses-frontend-git-main-ramesh-kumars-projects-bd92c359.vercel.app/" // Ensure this matches your frontend URL exactly (NO trailing slash)
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin); // Helps debug on Vercel logs
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Handle preflight requests explicitly by responding to OPTIONS without using path patterns
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});
// --- FIX END ---

app.use(express.json());
app.use(cookieParser());

// Mount API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/expenses', expenseRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("API is running successfully");
});

const PORT = process.env.PORT || 5000;

// Connect to DB first, then start server (local dev). Export app for serverless/Vercel.
connectDB()
    .then(() => {
        console.log("Database connected");
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
    })
    .catch((err) => {
        console.error("Failed to connect to database:", err);
        process.exit(1);
    });

export default app;