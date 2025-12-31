import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expense.js";

// Connect to MongoDB (safe to call on cold-start)
mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB Connected ✔"))
        .catch(err => console.error("MongoDB Error ❌:", err));

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// Export handler for serverless platforms (Vercel). Also keep a local
// development listener when running with `node server.js`.
const handler = serverless(app);

export default handler;

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on ${port} 🚀`));
}
