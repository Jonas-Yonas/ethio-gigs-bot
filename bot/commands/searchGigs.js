import { GigModel } from "../../models/gig.js";

export const searchGigsCommand = (bot) => {
  bot.command("searchgigs", async (ctx) => {
    const input = ctx.message.text.split(" ").slice(1);
    if (input.length === 0) {
      return ctx.reply("❌ Please provide a search keyword.");
    }

    // Parse budget filter from input
    let searchTerm = [];
    let budgetFilter = null;

    for (let i = 0; i < input.length; i++) {
      if (
        input[i] === "budget" &&
        (input[i + 1] === ">" || input[i + 1] === "<")
      ) {
        const operator = input[i + 1];
        const value = parseInt(input[i + 2]);
        if (!isNaN(value)) {
          budgetFilter = { operator, value };
          i += 2; // Skip over budget operator and value
          continue;
        }
      }
      searchTerm.push(input[i]);
    }

    try {
      const query = {
        $or: [
          { title: { $regex: searchTerm.join(" "), $options: "i" } },
          { description: { $regex: searchTerm.join(" "), $options: "i" } },
        ],
      };

      if (budgetFilter) {
        if (budgetFilter.operator === ">") {
          query.price = { $gt: budgetFilter.value };
        } else if (budgetFilter.operator === "<") {
          query.price = { $lt: budgetFilter.value };
        }
      }

      const gigs = await GigModel.find(query);

      if (gigs.length === 0) {
        return ctx.reply(`❌ No gigs found for "${searchTerm.join(" ")}"`);
      }

      let gigList = `📋 Gigs for "${searchTerm.join(" ")}":\n\n`;
      gigs.forEach((gig) => {
        gigList += `🆔 ${gig._id}\n🔹 ${gig.title}\n📝 ${
          gig.description
        }\n💰 Budget: ${gig.price || "Not specified"} ETB\n👤 @${
          gig.telegramId
        }\n\n`;
      });

      await ctx.reply(gigList);
    } catch (err) {
      console.error("Error searching gigs:", err);
      ctx.reply("❌ Failed to search gigs. Please try again.");
    }
  });
};
