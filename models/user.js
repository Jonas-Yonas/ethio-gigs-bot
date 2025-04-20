import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Gig" }],
});

const UserModel = mongoose.model("User", userSchema);

export { UserModel };
