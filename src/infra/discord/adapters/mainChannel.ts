import { TextChannel } from "discord.js";
import { client } from "../config.js";

export default () => {
  return client.channels.cache.get("855838535503970344") as TextChannel;
}
