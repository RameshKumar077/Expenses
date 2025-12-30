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

// Configure CORS to allow localhost dev and deployed frontend(s).
// Set CLIENT_ORIGIN in Vercel as a comma-separated list, e.g.
// http://localhost:5173,https://your-frontend.vercel.app
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map(s => s.trim());
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // allow server-to-server or curl
        if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
        return callback(new Error("CORS policy: This origin is not allowed"));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"]
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 5000;
// When running locally start the listener. In Vercel we export the app
// and platform will handle incoming requests.
if (!process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Server running on ${PORT} 🚀`));
}

export default app;
