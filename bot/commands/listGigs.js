import { GigModel } from "../../models/gig.js";
import { Markup } from "telegraf";

const PAGE_SIZE = 5;

export const listGigsCommand = (bot) => {
  bot.command("gigs", async (ctx) => {
    const page = parseInt(ctx.message.text.split(" ")[1]) || 1;
    const skip = (page - 1) * PAGE_SIZE;

    try {
      const gigs = await GigModel.find().skip(skip).limit(PAGE_SIZE);

      if (gigs.length === 0) {
        return ctx.reply("❌ No gigs found!");
      }

      for (const gig of gigs) {
        const messageText = `🔹 ${gig.title}\n📝 ${
          gig.description
        }\n💰 Budget: ${gig.price || "Not specified"} ETB\n👤 @${
          gig.telegramId || "unknown"
        }`;

        const buttons = [
          Markup.button.callback("👁 View Details", `VIEW_${gig._id}`),
          Markup.button.callback("🗑 Delete", `DELETE_${gig._id}`),
          Markup.button.callback("📄 Apply", `APPLY_${gig._id}`),
        ];

        if (gig.telegramId === String(ctx.from.id)) {
          buttons.push(Markup.button.callback("🗑 Delete", `DELETE_${gig._id}`));
        }

        await ctx.reply(messageText, Markup.inlineKeyboard(buttons));
      }

      // Pagination message
      const totalGigs = await GigModel.countDocuments();
      const totalPages = Math.ceil(totalGigs / PAGE_SIZE);
      if (page < totalPages) {
        await ctx.reply(`➡ Use /gigs ${page + 1} for next page.`);
      }
      if (page > 1) {
        await ctx.reply(`⬅ Use /gigs ${page - 1} to go back.`);
      }
    } catch (err) {
      console.error("Error in /gigs:", err.message);
      ctx.reply("❌ Failed to fetch gigs.");
    }
  });

  // Handle View Details button press
  bot.action(/VIEW_(.+)/, async (ctx) => {
    const gigId = ctx.match[1];
    const gig = await GigModel.findById(gigId);
    if (!gig) return ctx.answerCbQuery("❌ Gig not found!");

    const fullDetails = `📌 *${gig.title}*\n\n📝 ${
      gig.description
    }\n💰 Budget: ${gig.price || "Not specified"} ETB\n📂 Category: ${
      gig.category
    }\n🆔 ID: ${gig._id}`;

    await ctx.replyWithMarkdown(fullDetails);
    await ctx.answerCbQuery(); // Remove "loading" on button
  });

  bot.action(/APPLY_(.+)/, async (ctx) => {
    const gigId = ctx.match[1];
    const gig = await GigModel.findById(gigId);

    // You can customize this message as needed
    await ctx.reply(
      `You’ve applied for the gig: "${gig.title}". Good luck! 👍`
    );

    // Optionally, update the gig status or notify the gig owner
    // Example: Update the gig to reflect the user’s application
    // gig.applicants.push(ctx.from.id);
    // await gig.save();
  });

  // Handle Delete button press
  bot.action(/DELETE_(\w+)/, async (ctx) => {
    console.log("DELETE action triggered", ctx.match);
    const gigId = ctx.match[1];
    const gig = await GigModel.findById(gigId);

    if (gig.telegramId !== String(ctx.from.id)) {
      return ctx.reply("❌ You can only delete your own gigs.");
    }

    console.log("Sending confirmation buttons for delete");
    await ctx.reply(
      "Are you sure you want to delete this gig?",
      Markup.inlineKeyboard([
        Markup.button.callback("✅ Yes", `CONFIRM_DELETE_${gig._id}`),
        Markup.button.callback("❌ Cancel", `CANCEL_DELETE_${gig._id}`),
      ])
    );

    await ctx.answerCbQuery("Deletion process started. Please confirm.");
  });

  bot.action(/CONFIRM_DELETE_(\w+)/, async (ctx) => {
    console.log("Confirm delete triggered", ctx.match);
    const gigId = ctx.match[1];
    const gig = await GigModel.findById(gigId);

    if (!gig) {
      return ctx.reply("❌ Gig not found.");
    }

    // Proceed with deletion
    await GigModel.deleteOne({ _id: gigId });
    console.log(`Gig ${gigId} deleted.`);
    await ctx.reply("✅ Your gig has been deleted.");
    await ctx.answerCbQuery("Gig deleted successfully.");
  });

  bot.action(/CANCEL_DELETE_(\w+)/, async (ctx) => {
    console.log("Cancel delete triggered", ctx.match);
    await ctx.reply("❌ Gig deletion canceled.");
    await ctx.answerCbQuery("Gig deletion canceled.");
  });
};
