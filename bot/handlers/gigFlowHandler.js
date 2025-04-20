import { GigModel } from "../../models/gig.js";
import { getSession, clearSession } from "../commands/postGig.js";

export const handleGigFlow = async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message?.text;
  if (!text) return;

  const session = getSession(userId);
  if (!session) return;

  if (session.step === "title") {
    session.data.title = text;
    session.step = "description";
    ctx.reply("✍️ Great. Now enter a description.");
  } else if (session.step === "description") {
    session.data.description = text;
    session.step = "budget";
    ctx.reply("💰 What's your budget?");
  } else if (session.step === "budget") {
    session.data.budget = text;
    session.data.telegramId = userId;
    session.data.username = ctx.from.username;

    console.log("🧾 Attempting to save gig:", session.data);

    try {
      const savedGig = await GigModel.create(session.data);
      ctx.reply("✅ Gig posted successfully!");
    } catch (err) {
      console.error("❌ Failed to save gig:", err);
      ctx.reply("❌ Failed to post gig. Please try again.");
    }

    clearSession(userId);
  }
};
