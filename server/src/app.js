import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/error.js";

export function createApp() {
  const app = express();
  const origins = (process.env.CORS_ORIGIN || "*").split(",").map((s) => s.trim());

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors({ origin: origins.includes("*") ? true : origins, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));
  app.use("/api", rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: true, legacyHeaders: false }));

  app.use("/api", routes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
