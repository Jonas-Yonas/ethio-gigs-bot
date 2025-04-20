import { Markup } from "telegraf";
import { GigModel } from "../../models/gig.js";

const PAGE_SIZE = 5;

const categories = [
  "Delivery",
  "Service",
  "Maintenance",
  "Cleaning",
  "Design",
  "Other",
];

export const categoriesCommand = (bot) => {
  bot.command("categories", async (ctx) => {
    await ctx.reply(
      "🎯 Choose a category to view gigs:",
      Markup.inlineKeyboard(
        categories.map((cat) =>
          Markup.button.callback(cat, `category_${cat}_1`)
        ),
        { columns: 2 }
      )
    );
  });

  bot.action(/category_(.+)_(\d+)/, async (ctx) => {
    await ctx.answerCbQuery();

    const category = ctx.match[1];
    const page = parseInt(ctx.match[2], 10);
    const skip = (page - 1) * PAGE_SIZE;

    const gigs = await GigModel.find({ category }).skip(skip).limit(PAGE_SIZE);
    const total = await GigModel.countDocuments({ category });
    const totalPages = Math.ceil(total / PAGE_SIZE);

    if (gigs.length === 0) {
      return ctx.reply(`❌ No gigs found in "${category}" category.`);
    }

    let message = `📂 Gigs in *${category}* (Page ${page}/${totalPages}):\n\n`;
    gigs.forEach((gig) => {
      message += `🔹 ${gig.title}\n📝 ${gig.description}\n💰 Budget: ${gig.price} ETB\n\n`;
    });

    const buttons = [];

    if (page > 1) {
      buttons.push(
        Markup.button.callback("⬅ Prev", `category_${category}_${page - 1}`)
      );
    }
    if (page < totalPages) {
      buttons.push(
        Markup.button.callback("Next ➡", `category_${category}_${page + 1}`)
      );
    }

    await ctx.replyWithMarkdown(message, Markup.inlineKeyboard(buttons));
  });
};
