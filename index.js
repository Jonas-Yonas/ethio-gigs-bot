import { connectDB } from "./db/connect.js";
import { launchBot } from "./bot/bot.js";

const start = async () => {
  await connectDB();
  launchBot();
};

start();
