import { EmbedBuilder } from "discord.js"
import useChannel from "infra/discord/adapters/mainChannel.js"
import activeStatus from "infra/dynamodb/adapters/activeStatus.js";

export default async (pokemonName: string): Promise<void> => {
  const message = new EmbedBuilder()
    .setColor("#f39c12")
    .setDescription(`Oh no!! The ${pokemonName} run away!`);

  useChannel().send({ embeds: [message] });

  await activeStatus.update();
}
