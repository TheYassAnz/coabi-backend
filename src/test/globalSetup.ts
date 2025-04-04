import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const clientOptions = {
  serverApi: { version: "1" as const, strict: true, deprecationErrors: true },
};

export default async function globalSetup() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`, clientOptions);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
}
