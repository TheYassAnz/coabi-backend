import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
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
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

// Import routes
import refundRoutes from "./routes/refund";
import accommodationRoutes from "./routes/accommodation";
import eventRoutes from "./routes/event";
import ruleRoutes from "./routes/rule";
import taskRoutes from "./routes/task";
import fileRoutes from "./routes/file";

// Use routes
app.use("/api/refund", refundRoutes);
app.use("/api/accommodation", accommodationRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/rules", ruleRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/files", fileRoutes);

export default app;
