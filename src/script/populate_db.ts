import mongoose from "mongoose";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "process";
import { faker, fakerFR } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import User from "../models/user";
import Task from "../models/task";
import Refund from "../models/refund";
import Event from "../models/event";
import Accommodation from "../models/accommodation";
import dotenv from "dotenv";

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
    "==============================\nWhat do you want to do?\n==============================\n1. Populate database.\n2. Delete data from DB.\n3. Quit.\n==============================\n",
    (answer) => {
      console.log(`You want to: ${answer}`);
      rl.close();
      return answer;
    },
  );

  if (answer === "1") {
    console.log("Populating database...");

    // Create acoommodations.

    for (let i = 0; i <= 2; i++) {
      await new Accommodation({
        name: faker.company.name(),
        code: faker.number.int({ min: 1000, max: 9999 }).toString(),
        location: faker.location.city(),
        postalCode: fakerFR.location.zipCode(),
        country: faker.location.country(),
      }).save();
    }

    // Create 10 users.
    const accomadations = await Accommodation.find({});

    for (let i = 0; i <= 10; i++) {
      await new User({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: faker.internet.username(),
        password: await bcrypt.hash("password", 10),
        age: 30,
        description: faker.person.bio(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        accommodationId: accomadations[Math.floor(Math.random() * 4)]._id,
      }).save();
    }

    // Create tasks.

    const users = await User.find({});
    for (let i = 0; i < users.length; i++) {
      await new Task({
        name: faker.hacker.verb() + " " + faker.hacker.noun(),
        description: faker.lorem.paragraph(),
        weekly: faker.datatype.boolean(),
        done: faker.datatype.boolean(),
        userId: users[i]._id,
        accommodationId: users[i]._id,
      }).save();
    }

    // Create refunds

    for (let i = 0; i < 10; i++) {
      await new Refund({
        title: faker.commerce.productName(),
        toRefund: faker.number.int({ min: 0, max: 100 }),
        done: faker.datatype.boolean(),
        userId: users[Math.floor(Math.random() * users.length)]._id,
        roomateId: users[Math.floor(Math.random() * users.length)]._id,
      }).save();
    }

    // Create events
    for (let i = 0; i < 3; i++) {
      await new Event({
        title: faker.commerce.productName() + " " + faker.location.city(),
        description: faker.lorem.paragraph(),
        plannedDate: faker.date.future(),
        endDate: faker.date.future(),
        userId: users[Math.floor(Math.random() * users.length)]._id,
        accommodationId: users[Math.floor(Math.random() * users.length)]._id,
      }).save();
    }
    console.log("Database populated.");
    test();
  } else if (answer === "2") {
    console.log("Deleting data from DB...");
    await User.deleteMany({});
    await Task.deleteMany({});
    await Refund.deleteMany({});
    await Event.deleteMany({});
    await Accommodation.deleteMany({});
    console.log("Data deleted from DB.");
    process.exit(0);
  } else if (answer === "3") {
    console.log("Quitting...");
    process.exit(0);
  }
}
