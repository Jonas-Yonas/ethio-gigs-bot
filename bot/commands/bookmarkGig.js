import { UserModel } from "../../models/user.js";
import { GigModel } from "../../models/gig.js";

// bookmark a gig
export const bookmarkCommands = (bot) => {
  bot.command("bookmark", async (ctx) => {
    const gigId = ctx.message.text.split(" ")[1];
    if (!gigId) return ctx.reply("❌ Please provide a gig ID to bookmark.");

    try {
      const gig = await GigModel.findById(gigId);
      if (!gig) return ctx.reply("❌ Gig not found.");

      const user = await UserModel.findOneAndUpdate(
        { telegramId: ctx.from.id.toString() },
        {
          telegramId: ctx.from.id.toString(),
          username: ctx.from.username,
          $addToSet: { bookmarks: gig._id },
        },
        { upsert: true, new: true }
      );

      ctx.reply("✅ Gig bookmarked successfully.");

      return user;
    } catch (err) {
      console.error("Bookmark error:", err);
      ctx.reply("❌ Failed to bookmark the gig.");
    }
  });

  // list my bookmarked gigs
  bot.command("mybookmarks", async (ctx) => {
    try {
      const user = await UserModel.findOne({
        telegramId: ctx.from.id.toString(),
      }).populate("bookmarks");
      if (!user || user.bookmarks.length === 0)
        return ctx.reply("🔖 You have no bookmarked gigs.");

      let msg = "🔖 Your bookmarked gigs:\n\n";
      user.bookmarks.forEach((gig) => {
        msg += `🔹 ${gig.title}\n📝 ${gig.description}\n💰 ${gig.price} ETB\n🆔 ${gig._id}\n\n`;
      });

      ctx.reply(msg);
    } catch (err) {
      console.error("Fetch bookmarks error:", err);
      ctx.reply("❌ Failed to fetch bookmarks.");
    }
  });
};
