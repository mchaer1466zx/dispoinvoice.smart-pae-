import { defineConfig } from "drizzle-kit";
import { resolveDbCredentials } from "./src/lib/db-env";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "turso",
  dbCredentials: resolveDbCredentials(),
});
