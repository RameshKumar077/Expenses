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
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

app.listen(5000, () => console.log("Server running on 5000 🚀"));
