import mongoose from "mongoose";
import { env } from "./env";

mongoose.set("strictQuery", true);

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.MONGODB_URI, {
      dbName: env.DB_NAME,
    });
  }

  await connectionPromise;
};
