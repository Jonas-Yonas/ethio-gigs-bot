import { Composer, Markup } from "telegraf";
import { GigModel } from "../../models/gig.js";

const editGig = new Composer();
const editSessions = new Map();

editGig.command("editgig", async (ctx) => {
  const userId = ctx.from.id;
  const gigs = await GigModel.find({ telegramId: userId });

  if (!gigs.length) {
    return ctx.reply("❌ You haven't posted any gigs yet.");
  }

  const titles = gigs.map((gig, i) => `${i + 1}. ${gig.title}`).join("\n");
  await ctx.reply(
    `📋 Your Gigs:\n\n${titles}\n\nPlease reply with the *exact* title of the gig you want to edit.`,
    { parse_mode: "Markdown" }
  );
  editSessions.set(userId, { step: "awaiting_gig_title", gigs });
});

editGig.on("text", async (ctx) => {
  const userId = ctx.from.id;
  const session = editSessions.get(userId);
  if (!session) return;

  if (session.step === "awaiting_gig_title") {
    const gig = session.gigs.find((g) => g.title === ctx.message.text.trim());
    if (!gig) {
      return ctx.reply(
        "❌ Couldn't find a gig with that title. Please try again."
      );
    }

    session.gigToEdit = gig;
    session.step = "awaiting_field_choice";

    return ctx.reply(
      "What would you like to edit?",
      Markup.inlineKeyboard([
        [Markup.button.callback("📝 Title", "edit_title")],
        [Markup.button.callback("🗒️ Description", "edit_description")],
        [Markup.button.callback("💰 Budget", "edit_budget")],
      ])
    );
  }

  if (session.step === "awaiting_field_value") {
    const newValue = ctx.message.text.trim();
    session.gigToEdit[session.fieldToEdit] = newValue;

    await session.gigToEdit.save();
    editSessions.delete(userId);

    return ctx.reply("✅ Gig updated successfully!");
  }
});

editGig.action(/edit_(title|description|budget)/, async (ctx) => {
  const userId = ctx.from.id;
  const session = editSessions.get(userId);
  if (!session || !session.gigToEdit) return;

  const field = ctx.match[1];
  session.fieldToEdit = field;
  session.step = "awaiting_field_value";

  await ctx.answerCbQuery(); // dismiss button loader
  return ctx.reply(`✍️ Please send the new ${field}.`);
});

export default editGig;
