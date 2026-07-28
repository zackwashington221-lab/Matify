import "dotenv/config";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

const port = Number(process.env.PORT) || 4000;

connectDB()
  .then(() => {
    createApp().listen(port, () => console.log(`[api] listening on http://localhost:${port}/api`));
  })
  .catch((err) => {
    console.error("[api] failed to start:", err.message);
    process.exit(1);
  });
