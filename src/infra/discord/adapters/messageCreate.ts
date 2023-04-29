import { EmbedBuilder, Message } from "discord.js";
import activeStatus from "../../dynamodb/adapters/activeStatus.js";
import ownedpokemon from "../../mongodb/adapters/ownedpokemon.js";
import prestige from "../../mongodb/adapters/prestige.js";
import { ActivePokemon } from "types/activeStatus.js";
import mainChannel from "./mainChannel.js";

export async function handleMessage(message: Message) {
  if (message.content.split(" ").length > 1)
    return

  const last = await activeStatus.getLast()
  const m = message.content.toLowerCase()

  if (m === last.pokemon?.name.toLocaleLowerCase()) {
    catchPokemon(last.pokemon, message.author.id)
  }
}

async function catchPokemon(pokemon: ActivePokemon, user: string) {
  await Promise.all([
    ownedpokemon.create(pokemon, user),
    prestige.userCatchPokemon(user, pokemon.id),
    activeStatus.update(),
  ])

  const message = new EmbedBuilder()
    .setColor("#f39c12")
    .setDescription(`<@${user}> caught a ${pokemon.shiny ? '✨' : ''} ${pokemon.name}!`);

  return mainChannel().send({ embeds: [message] });
}
