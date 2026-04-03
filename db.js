import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectDB() {
  await client.connect();
  console.log("MongoDB Connected");
  return client.db("myntra");
}