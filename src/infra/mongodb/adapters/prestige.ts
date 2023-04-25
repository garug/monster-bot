import { client } from "../config.js";

function userCatchPokemon(user, id_dex) {
  const collection = client.db().collection("prestiges");

  return collection.updateOne(
    { user, id_dex },
    { $inc: { value: 200 } },
    { upsert: true }
  );
}

export default {
  userCatchPokemon,
}
