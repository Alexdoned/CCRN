import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);



import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { connectDB } from "../config/db.js";

import adminRoutes from "./routes/adminRoutes.js";
import leaderRoutes from "./routes/leaderRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const _dirname = path.resolve(); // Moved to the top so it is defined before use

// Core Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/leaders", leaderRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// Optional Base API check
app.get("/api/product", (req, res) => {
    res.json({ message: "Database API endpoint is active." });
});

// Production Frontend Static File Serving
// This serves your Vite production build from the frontend/dist folder
// Clean up trailing spaces from Windows environment variables if present
const currentEnv = (process.env.NODE_ENV || '').trim().toLowerCase();

// Serve static frontend assets in production (default unless explicitly "development")
if (currentEnv === "development" || currentEnv === "dev") {
    console.log("⚙️ Server running in DEVELOPMENT mode.");
    app.get("/", (req, res) => {
        res.send("API Server is running in development mode...");
    });
} else {
    console.log("🚀 Server running in PRODUCTION mode. Serving static frontend assets.");
    app.use(express.static(path.join(_dirname, "frontend/dist")));
    
    // Catch-all route to serve the React single-page app for any frontend URL
    // Excludes /api routes so they return proper 404s instead of the HTML shell
    app.get("/*splat", (req, res) => {
        if (req.originalUrl.startsWith("/api")) {
            return res.status(404).json({ success: false, message: "API route not found." });
        }
        res.sendFile(path.join(_dirname, "frontend/dist/index.html"));
    });
}

    


// Start Server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});


