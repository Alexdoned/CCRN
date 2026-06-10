import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "../config/db.js";
import path from "path";

import adminRoutes from "./routes/adminRoutes.js";
import leaderRoutes from "./routes/leaderRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/las_db", production);
app.use(express.static(path.join(_dirname, "frontend/dist")));
app.get("/*splat", (req, res) => {
    res.sendFile(path.join(_dirname, "frontend/dist/index.html"));
});

// API routes
app.use("/api/admin", adminRoutes);
app.use("/api/leaders", leaderRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

app.get("/", (req, res) => {
    res.send("API Server is running...");
});

const PORT = process.env.PORT || 5000;
const _dirname = path.resolve();

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});

