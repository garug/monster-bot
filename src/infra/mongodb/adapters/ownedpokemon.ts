import random from "lodash.random"
import randomstring from "randomstring"
import { ActivePokemon } from "types/activeStatus.js";
import { client } from "../config.js";

const { generate } = randomstring;

function create(pokemon: ActivePokemon, user: string) {
  const { name, id, shiny } = pokemon;

  const copy = {};
  Object.keys(pokemon.stats).forEach((a) => {
    copy[a] = generateNumber(pokemon.stats[a]);
  });

  const entry = {
    id: generate(6),
    id_dex: id,
    name,
    user,
    original_user: user,
    attributes: copy,
    level: 0,
    marks: {
      shiny,
    },
    created_at: new Date(),
  }

  const collection = client.db().collection("ownedpokemons");

  return collection.insertOne(entry);
}


function generateNumber(number) {
  const chance = Math.random();
  if (chance < 0.7) {
    return number * random(0.8, 1.25);
  } else if (chance < 0.9) {
    return number * random(1.25, 1.4);
  } else if (chance < 0.95) {
    return number * random(1.4, 1.65);
  } else if (chance < 0.99) {
    return number * random(1.75, 2);
  } else {
    return number * 3;
  }
}

export default {
  create,
}
