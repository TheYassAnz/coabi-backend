import mongoose from "mongoose";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "process";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import User from "../models/user";
import dotenv from "dotenv";
import { exit } from "node:process";
dotenv.config();

const clientOptions = {
  serverApi: { version: "1" as const, strict: true, deprecationErrors: true },
};

mongoose
  .connect(`${process.env.MONGODB_URI}`, clientOptions)
  .then(() => {
    console.log("Connected to MongoDB");
    test();
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

async function test() {
  const rl = readline.createInterface({ input, output });

  const answer = await rl.question(
    "==============================\nWhat do you want to do?\n==============================\n1. Populate database.\n2. Delete data from DB.\n",
    (answer) => {
      console.log(`You want to: ${answer}`);
      rl.close();
      return answer;
    },
  );

  if (answer === "1") {
    console.log("Populating database...");
    await new User({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.username(),
      password: await bcrypt.hash("password", 10),
      age: 30,
      description: faker.person.bio(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
    }).save();
    process.exit(0);
  } else {
    console.log("No action taken.");
    process.exit(0);
  }
}
