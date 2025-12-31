import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

// Safely connect to MongoDB only when a URI is provided. In serverless
// environments a missing or failing connection can surface during init
// and cause function invocation failures. Log and continue so the
// process doesn't crash silently.
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB Connected ✔"))
        .catch(err => console.error("MongoDB Error ❌:", err));
} else {
    console.warn('MONGO_URI not provided — skipping MongoDB connection (server will return errors for DB routes)');
}

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
app.get('/', (req, res) => res.send('API server is running'));
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// Simple health/root route to make root requests return a friendly message
// instead of a 404 or crash — useful when testing deployed functions.
app.get('/', (req, res) => res.send('API server is running'));

// Global error and rejection handlers to ensure errors are logged.
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

const PORT = process.env.PORT || 5000;
// When running locally start the listener. In Vercel we export the app
// and platform will handle incoming requests.
if (!process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Server running on ${PORT} 🚀`));
}

export default app;
