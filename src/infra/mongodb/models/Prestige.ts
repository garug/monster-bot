import { Document, model, Schema } from "mongoose";

export interface Prestige extends Document {
  user: string;
  id_dex: number;
  value: number;
}

export const PrestigeSchema = new Schema({
  user: String,
  id_dex: Number,
  value: Number,
});

export default model<Prestige>("Prestige", PrestigeSchema);
