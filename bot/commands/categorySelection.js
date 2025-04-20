import { GigModel } from "../../models/gig.js";

const categorySelection = (bot, sessions) => {
  bot.action(/^select_category_(.+)$/, async (ctx) => {
    const category = ctx.match[1];
    const userId = ctx.from.id;

    const session = sessions[userId];
    if (!session || session.step !== "awaiting_category") return;

    session.data.category = category;

    // 💡 Ensure we're using `price`, not `budget`
    const newGig = new GigModel({
      title: session.data.title,
      description: session.data.description,
      price: session.data.budget, // 👈 This is the fix
      category,
      telegramId: userId,
      telegramUsername: ctx.from.username || "",
    });

    await newGig.save();
    delete sessions[userId];

    await ctx.answerCbQuery();
    return ctx.reply("✅ Your gig has been posted successfully!");
  });
};

export default categorySelection;
