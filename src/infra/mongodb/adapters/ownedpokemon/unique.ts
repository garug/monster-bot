import { PipelineStage } from "mongoose";
import OwnedPokemon from "../../../mongodb/models/OwnedPokemon.js";

export default async function(user: string) {
  const match: PipelineStage = { $match: {} };

  if (user)
    match.$match.user = user;

  const result = await OwnedPokemon.aggregate([
    match, {
      $group: {
        _id: '$id_dex'
      }
    }, {
      $count: 'total'
    } ]);

  return result[0].total;
}
