import { MongoClient } from "mongodb"

export const client = new MongoClient(process.env.DB_MONGO_URL || "mongodb://localhost:27017/test");
