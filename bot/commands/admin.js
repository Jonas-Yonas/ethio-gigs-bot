import { ADMIN_IDS } from "../../config/env.js";
import { GigModel } from "../../models/gig.js";

// Admin-only command example
export const adminCommands = (bot) => {
  bot.command("stats", async (ctx) => {
    console.log(`ADMIN_IDS: `, ADMIN_IDS, " and ", ctx.from.id.toString());
    if (!ADMIN_IDS.includes(ctx.from.id.toString())) {
      return ctx.reply("🚫 You are not authorized to use this command.");
    }

    // Example logic for fetching stats (like active gigs count)
    const activeGigsCount = await GigModel.countDocuments({ status: "active" });

    ctx.reply(`📊 Here are your stats: \nActive Gigs: ${activeGigsCount}`);
  });

  // Example of another admin command - Broadcast message
  bot.command("broadcast", async (ctx) => {
    if (!ADMIN_IDS.includes(ctx.from.id.toString())) {
      return ctx.reply("🚫 You are not authorized to use this command.");
    }

    const message = ctx.message.text.split(" ").slice(1).join(" "); // Get the message from the command
    // Broadcast the message to all users (for example, in your user database)
    // For simplicity, assuming you have a list of user IDs:
    const userIds = ["user_1", "user_2"]; // Replace with actual user IDs

    userIds.forEach(async (userId) => {
      try {
        await bot.telegram.sendMessage(userId, message);
      } catch (error) {
        console.error("Error sending broadcast:", error);
      }
    });

    ctx.reply("📢 Message broadcasted to users.");
  });
};
