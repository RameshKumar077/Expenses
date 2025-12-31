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
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "..", "client1", "dist");

if (process.env.NODE_ENV === "production") {
    app.use(express.static(clientBuildPath));

    app.use((req, res) => {
        res.sendFile(path.join(clientBuildPath, "index.html"));
    });
}

app.listen(5000, () => console.log("Server running on 5000 🚀"));
