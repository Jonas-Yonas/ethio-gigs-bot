import { UserModel } from "../../models/user.js";

export const viewBookmarksCommand = (bot) => {
  bot.command("mybookmarks", async (ctx) => {
    const telegramId = ctx.from.id.toString();
    const user = await UserModel.findOne({ telegramId }).populate("bookmarks");

    if (!user || user.bookmarks.length === 0) {
      return ctx.reply("📭 You have no bookmarked gigs.");
    }

    let response = "🔖 Your bookmarked gigs:\n\n";
    user.bookmarks.forEach((gig) => {
      response += `🔹 ${gig.title}\n💰 ${gig.price} ETB\n📝 ${gig.description}\n\n`;
    });

    ctx.reply(response);
  });
};
