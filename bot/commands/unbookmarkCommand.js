import mongoose from "mongoose";
import { UserModel } from "../../models/user.js";

export const unbookmarkCommand = (bot) => {
  bot.command("unbookmark", async (ctx) => {
    const gigId = ctx.message.text.split(" ")[1];

    if (!gigId || !mongoose.Types.ObjectId.isValid(gigId)) {
      return ctx.reply("❌ Please provide a valid Gig ID.");
    }

    try {
      const user = await UserModel.findOne({ telegramId: ctx.from.id });

      if (!user) {
        return ctx.reply("❌ You have no bookmarks.");
      }

      const isBookmarked = user.bookmarks.some((id) => id.toString() === gigId);

      if (!isBookmarked) {
        return ctx.reply("❌ This gig is not in your bookmarks.");
      }

      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== gigId);
      await user.save();

      ctx.reply("✅ Gig removed from bookmarks.");
    } catch (err) {
      console.error("Unbookmark error:", err);
      ctx.reply("❌ Failed to remove bookmark.");
    }
  });
};
