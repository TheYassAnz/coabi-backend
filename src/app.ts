import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import refundRoutes from "./routes/refund";
import eventRoutes from "./routes/event";

dotenv.config();
import mongoose from "mongoose";

const clientOptions = {
  serverApi: { version: "1" as const, strict: true, deprecationErrors: true },
};

mongoose
  .connect(`${process.env.MONGODB_URI}`, clientOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

app.use("/api/refund", refundRoutes);
app.use("/api/events", eventRoutes);

export default app;
