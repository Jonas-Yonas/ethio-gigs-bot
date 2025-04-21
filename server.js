import express from "express";
import cors from "cors";
import { connectDB } from "./db/connect.js";
import { launchBot } from "./bot/bot.js";
import gigsRouter from "./admin/routes/gigs.js"; // ← We'll create this next

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000", // Local dev
  "https://ethio-gigs-admin.vercel.app", // Vercel frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  credentials: true,
};
app.use(cors(corsOptions));

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
