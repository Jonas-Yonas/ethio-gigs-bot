import dotenv from "dotenv";
dotenv.config();

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
export const MONGODB_URI = process.env.MONGODB_URI;
export const ADMIN_IDS = process.env.ADMIN_IDS?.split(",");
