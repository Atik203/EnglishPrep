import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import { connectDatabase } from "../src/config/database";

let connectionInitialised = false;

const ensureConnection = async (): Promise<void> => {
  if (connectionInitialised) {
    return;
  }

  await connectDatabase();
  connectionInitialised = true;
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  await ensureConnection();
  app(req as never, res as never);
}
