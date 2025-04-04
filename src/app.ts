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
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";

// Use routes
app.use("/api/refunds", refundRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rules", ruleRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

export default app;
