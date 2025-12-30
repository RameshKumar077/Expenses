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

const PORT = process.env.PORT || 5000;
// When running locally (or via `node server.js`) start the listener.
// In serverless environments (Vercel) the platform will import this file
// and handle requests without calling `listen`, so avoid listening there.
if (!process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Server running on ${PORT} 🚀`));
}

// Export the Express app so serverless builders can import and use it.
export default app;
