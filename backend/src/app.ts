import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type RequestHandler } from "express";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { configureGoogleAuth } from "./modules/auth/auth.passport";
import routes from "./routes";

const app = express();

// Configure passport
configureGoogleAuth();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
const sessionMiddleware = session({
  secret:
    process.env.SESSION_SECRET || "your-session-secret-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}) as unknown as RequestHandler;
app.use(sessionMiddleware);
const passportInitMiddleware =
  passport.initialize() as unknown as RequestHandler;
const passportSessionMiddleware = passport.session() as RequestHandler;
app.use(passportInitMiddleware);
app.use(passportSessionMiddleware);
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(env.API_BASE_PATH, routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
