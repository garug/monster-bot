import axios from "axios"
import { EmbedBuilder } from "discord.js";
import isEqual from "lodash.isequal"
import random from "lodash.random"
import mainChannel from "infra/discord/adapters/mainChannel.js";
import activeStatus from "infra/dynamodb/adapters/activeStatus.js";
import { client } from "infra/mongodb/config.js";

export default async () => {
  const sorted = await sort()

  return Promise.all([
    activeStatus.update(sorted),
    sendMessages(sorted.chance, sorted.shiny, sorted.image)
  ])
}

async function sort() {
  const promisePossiblePokemon = client.db()
    .collection("sets")
    .find({ active: true })
    .toArray();

  const possiblePokemon = Array.from(await promisePossiblePokemon)
    .flatMap((set) => set.pokemon);

  const sortedPokemon = infoSort(possiblePokemon);

  const info = await client.db()
    .collection("infopokemons")
    .findOne({ id_dex: sortedPokemon.sorted.id_dex });

  let form;

  if (info?.forms && info.forms.length > 1) {
    form = infoSort(info.forms).sorted
  }

  const pokemon = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${form?.id_api || sortedPokemon.sorted.id_dex}/`
  );

  const { name, stats, species, sprites } = pokemon.data;

  const chances = [sortedPokemon.chance];

  const shinyRate = 0.01;
  const shiny = Math.random() < shinyRate;
  chances.push(shiny ? shinyRate : 1 - shinyRate);

  const chance = chances.reduce((acc, e) => acc * e);

  return {
    name: form?.name || (form?.use_specie_name ? species.name : name),
    form: form?.id,
    stats,
    id: sortedPokemon.sorted.id_dex,
    shiny,
    chance,
    image: sprites.other["official-artwork"].front_default
  }
}

function infoSort(possibities) {
  let total = 0;

  const mapToPossibility = (p) => p.chance;

  const usedPossibilities = possibities
    .map(mapToPossibility)
    .map(n => {
      total += n;
      return total;
    });

  const index = usedPossibilities.findIndex((n) => n >= random(1, total));

  const sorted = possibities[index];

  const chance = possibities
    .filter(e => isEqual(e, sorted))
    .map(mapToPossibility)
    .reduce((acc, e) => acc + e) / total

  return {
    sorted,
    chance,
    total,
  }
}

async function sendMessages(chance, isShiny, image) {
  const message = new EmbedBuilder()
    .setColor("#f39c12")
    .setTitle("A wild pokemon appeared")
    .setDescription("Who's that pokemon?" + (isShiny ? " ✨✨✨" : ""))
    .setFooter({ text: "Chance of that pokemon: " + (chance * 100).toFixed(3) + "%" })
    .setImage(image);

  await mainChannel().send({ embeds: [message] });
}
