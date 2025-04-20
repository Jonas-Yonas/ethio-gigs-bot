import { Telegraf } from "telegraf";
import { TELEGRAM_BOT_TOKEN } from "../config/env.js";
import { postGigCommand } from "./commands/postGig.js";
import { handleGigFlow } from "./handlers/gigFlowHandler.js";

import { listGigsCommand } from "./commands/listGigs.js";
import { deleteGigCommand } from "./commands/deleteGig.js";
import editGig from "./commands/editGig.js";

import { searchGigsCommand } from "./commands/searchGigs.js";

import categorySelection from "./commands/categorySelection.js";
import { categoriesCommand } from "./commands/categories.js";
import { sessions } from "./commands/postGig.js";

import { adminCommands } from "./commands/admin.js";
import { helpCommand } from "./commands/help.js";
import { bookmarkCommands } from "./commands/bookmarkGig.js";
import { viewBookmarksCommand } from "./commands/viewBookmarks.js";
import { unbookmarkCommand } from "./commands/unbookmarkCommand.js";

export const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply("Welcome to EthioGigs! 🤖 Type /help to learn how to use the bot.")
);
bot.command("ping", (ctx) => ctx.reply("Pong 🏓"));

helpCommand(bot);
listGigsCommand(bot);
searchGigsCommand(bot);
categoriesCommand(bot);
deleteGigCommand(bot);

bookmarkCommands(bot);
viewBookmarksCommand(bot);
unbookmarkCommand(bot);

adminCommands(bot);

postGigCommand(bot);

categorySelection(bot, sessions);

bot.use(editGig);

bot.on("text", handleGigFlow);

export const launchBot = () => {
  bot.launch();
  console.log("🚀 Bot started");
};
