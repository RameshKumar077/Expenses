import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected ✔"))
    .catch(err => console.error("MongoDB Error ❌:", err));

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expense.js";

const app = express();

// CORS configuration: allow local dev and deployed client, and allow Authorization header
const corsOptions = {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT} 🚀`));
