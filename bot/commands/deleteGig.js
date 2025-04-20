import { GigModel } from "../../models/gig.js";

export const deleteGigCommand = (bot) => {
  bot.command("deletegig", async (ctx) => {
    const userId = ctx.from.id;
    const username = ctx.from.username;

    const gigs = await GigModel.find({ telegramId: userId });

    if (gigs.length === 0) {
      return ctx.reply("❌ You have no gigs to delete.");
    }

    const gigTitles = gigs.map((gig) => gig.title).join("\n");

    ctx.reply(
      `🗑️ Please reply with the title of the gig you want to delete:\n\n${gigTitles}`
    );

    // Listen for the user's response and delete the gig based on the title
    bot.on("text", async (responseCtx) => {
      if (responseCtx.from.id !== userId) return; // Ensure the message is from the same user

      const titleToDelete = responseCtx.message.text;
      const gigToDelete = gigs.find((gig) => gig.title === titleToDelete);

      if (!gigToDelete) {
        return responseCtx.reply(
          "❌ Gig not found. Please try again with a valid title."
        );
      }

      try {
        await GigModel.deleteOne({ _id: gigToDelete._id });
        responseCtx.reply(
          `✅ Your gig titled "${titleToDelete}" has been deleted successfully.`
        );
      } catch (err) {
        console.error("Error during gig deletion:", err);
        responseCtx.reply("❌ Failed to delete the gig. Please try again.");
      }
    });
  });
};
