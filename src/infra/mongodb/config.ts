import mongoose from "mongoose";
import { MongoClient } from "mongodb"

const uri = process.env.DB_MONGO_URL || "mongodb://localhost:27017/test"

export const client = new MongoClient(uri);

export default class MongoDatabase {
  connect(): void {
    console.log("Connecting to database...");
    mongoose
      .connect(uri, {
        autoIndex: true
      })
      .then(() => console.log("Database Connected!"))
      .catch((error) => {
        console.log("Error connecting to database: ", error);
        return process.exit(1);
      });
  }
}
