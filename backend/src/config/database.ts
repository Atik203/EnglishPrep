import mongoose from "mongoose";
import { env } from "./env";

mongoose.set("strictQuery", true);

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.MONGODB_URI, {
    dbName: env.DB_NAME,
  });
};
