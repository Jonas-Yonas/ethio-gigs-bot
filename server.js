import express from "express";
import cors from "cors";
import { connectDB } from "./db/connect.js";
import { launchBot } from "./bot/bot.js";
import gigsRouter from "./admin/routes/gigs.js"; // ← We'll create this next

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000", // Local dev
    "https://ethio-gigs-admin.vercel.app", // Vercel frontend
  ], // Allow requests from frontend
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"], // Allow these methods
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/gigs", gigsRouter); // Frontend will call this

// Start DB, bot, and server
const start = async () => {
  try {
    await connectDB();
    launchBot();

    app.listen(PORT, () => {
      console.log(`✅ Admin API server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

start();
