import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: String, default: "active" },
    username: { type: String, required: true },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const GigModel = mongoose.model("Gig", gigSchema);

export { GigModel };
