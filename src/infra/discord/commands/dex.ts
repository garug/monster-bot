import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ServerCommand } from "../config_commands.js";
import ownedpokemon from "infra/mongodb/adapters/ownedpokemon.js";

const name = "dex"

const builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription("Replies your current dex status")

export const command: ServerCommand = {
  name,
  builder,
  execute: async (interaction) => {
    const p1 = ownedpokemon.find({ user: interaction.user.id }, { size: 6, page: 1 });

    const p2 = ownedpokemon.unique(interaction.user.id);

    const [ownedPokemon, uniquePokemon] = await Promise.all([p1, p2]);

    const strongest = ownedPokemon.content.map((e) => e.name);
    const reply = new EmbedBuilder().setColor("#f39c12").setDescription(
      `${interaction.user} dex: ${uniquePokemon}/493

  Strongest pokemon: ${strongest}

  Full dex: ${process.env.FRONTEND_URL}/usuarios/${interaction.user.id}`
    );
    interaction.reply({ embeds: [reply] })
    return;
  }
}

