import { Markup } from "telegraf";
import { GigModel } from "../../models/gig.js";

const sessions = {}; // In-memory session store

// Rate limit config
const rateLimitMap = new Map();
const RATE_LIMIT_INTERVAL_MS = 60 * 1000;

const categories = [
  "Delivery",
  "Service",
  "Maintenance",
  "Cleaning",
  "Design",
  "Other",
];

export const postGigCommand = (bot) => {
  bot.command("postgig", async (ctx) => {
    const userId = ctx.from.id;
    const now = Date.now();
    const lastTime = rateLimitMap.get(userId) || 0;

    if (now - lastTime < RATE_LIMIT_INTERVAL_MS) {
      const waitSeconds = Math.ceil(
        (RATE_LIMIT_INTERVAL_MS - (now - lastTime)) / 1000
      );
      return ctx.reply(
        `⏳ Please wait ${waitSeconds}s before posting another gig.`
      );
    }

    rateLimitMap.set(userId, now);
    sessions[userId] = { step: "title", data: {} };
    ctx.reply("📢 Let's post a new gig!\n\nWhat's the gig *title*?", {
      parse_mode: "Markdown",
    });
  });

  bot.on("text", async (ctx) => {
    const userId = ctx.from.id;
    const session = sessions[userId];
    if (!session) return;

    const message = ctx.message.text.trim();

    if (session.step === "title") {
      session.data.title = message;
      session.step = "description";
      return ctx.reply("📝 Great! Now send the *description* of the gig.", {
        parse_mode: "Markdown",
      });
    }

    if (session.step === "description") {
      session.data.description = message;
      session.step = "price";
      return ctx.reply("💰 Almost done! What's the *budget* for this gig?", {
        parse_mode: "Markdown",
      });
    }

    if (session.step === "price") {
      session.data.price = message;
      session.step = "category";

      return ctx.reply(
        "📋 Please select a category for your gig:",
        Markup.inlineKeyboard(
          categories.map((c) =>
            Markup.button.callback(c, `select_category_${c}`)
          )
        )
      );
    }
  });

  bot.action(/select_category_(.*)/, async (ctx) => {
    const userId = ctx.from.id;
    const session = sessions[userId];
    if (!session) return;

    const category = ctx.match[1];
    session.data.category = category;

    const newGig = new GigModel({
      title: session.data.title,
      description: session.data.description,
      price: session.data.price, // ✅ corrected
      category: session.data.category,
      telegramId: userId,
      telegramUsername: ctx.from.username || "",
      username: ctx.from.username || "unknown",
      moderationStatus: "pending",
    });

    await newGig.save();
    delete sessions[userId];

    await ctx.answerCbQuery();
    return ctx.reply("✅ Your gig has been posted successfully!");
  });
};

export const getSession = (userId) => sessions[userId];
export const clearSession = (userId) => {
  delete sessions[userId];
};

export { sessions };
