import { Markup } from "telegraf";

export const helpCommand = (bot) => {
  bot.command("help", (ctx) => {
    return showHelpMenu(ctx);
  });

  const showHelpMenu = (ctx) => {
    const message = `
📖 *EthioGigs Bot Commands*

Use the buttons below to explore features 👇
    `;
    return ctx.reply(message, {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback("🎯 Post a Gig", "help_postgig"),
          Markup.button.callback("📄 My Gigs", "help_mygigs"),
        ],
        [
          Markup.button.callback("🔍 Search Gigs", "help_searchgigs"),
          Markup.button.callback("📚 Bookmarks", "help_bookmarks"),
        ],
        [
          Markup.button.callback("🛠 Admin Tools", "help_admin"),
          Markup.button.callback("💡 Tips", "help_tips"),
        ],
      ]),
    });
  };

  const backButton = Markup.inlineKeyboard([
    [Markup.button.callback("🔙 Back to Help Menu", "help_back")],
  ]);

  bot.action("help_back", (ctx) => {
    ctx.answerCbQuery();
    return showHelpMenu(ctx);
  });

  bot.action("help_postgig", (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(
      `🎯 *Post a Gig*\nUse /postgig to add a new gig. You'll be asked for title, description, budget, and category.`,
      { parse_mode: "Markdown", ...backButton }
    );
  });

  bot.action("help_mygigs", (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(
      `📄 *My Gigs*\nUse /mygigs to see your posted gigs.\nUse /editgig <gig_id> or /deletegig <gig_id> to manage them.`,
      { parse_mode: "Markdown", ...backButton }
    );
  });

  bot.action("help_searchgigs", (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(
      `🔍 *Search Gigs*\nUse /searchgigs <keyword> [budget >|< amount].\nExample: \`/searchgigs logo budget > 3000\``,
      { parse_mode: "Markdown", ...backButton }
    );
  });

  bot.action("help_bookmarks", (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(
      `📚 *Bookmarks*\n/bookmark <gig_id> - Save a gig\n/mybookmarks - View your saved gigs\n/unbookmark <gig_id> - Remove saved gig`,
      { parse_mode: "Markdown", ...backButton }
    );
  });

  bot.action("help_admin", (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(
      `🛠 *Admin Tools*\n/stats - Show platform stats\n/broadcast <message> - Send a message to all users (admin only)`,
      { parse_mode: "Markdown", ...backButton }
    );
  });

  bot.action("help_tips", (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(
      `💡 *Tips*\n- Gig IDs appear in /mygigs and /searchgigs\n- Use clear titles for visibility\n- Budget filter: \`/searchgigs web budget > 5000\`\nMore features coming soon 🚀`,
      { parse_mode: "Markdown", ...backButton }
    );
  });
};
