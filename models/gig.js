import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },

    username: { type: String, required: true },
    views: {
      type: Number,
      default: 0,
    },
    // Status of the gig lifecycle (active = available, expired = completed)
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },

    // NEW: Moderation status for approval/rejection
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // 🆕 default to pending on new gig creation
    },
  },
  { timestamps: true }
);

const GigModel = mongoose.model("Gig", gigSchema);

export { GigModel };
