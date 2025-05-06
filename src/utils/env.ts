import dotenv from "dotenv";
dotenv.config();

export const testEnv = process.env.NODE_ENV === "test";
