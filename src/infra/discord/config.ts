import { Client, GatewayIntentBits, Message } from "discord.js";
import { handleMessage } from "./adapters/messageCreate.js";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.login(process.env.DISCORD_TOKEN).then(() => {
  console.log("Logged in!");
});

client.on("messageCreate", handleMessage)
