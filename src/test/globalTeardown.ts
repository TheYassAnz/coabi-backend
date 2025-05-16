import mongoose from "mongoose";

export default async function globalTeardown() {
  try {
    console.log("Disconnecting from MongoDB...");
    await mongoose.disconnect();

    console.log("Completed.");
  } catch (error) {
    console.error("Error during global teardown", error);
  }
}
