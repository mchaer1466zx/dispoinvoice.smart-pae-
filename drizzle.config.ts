import { defineConfig } from "drizzle-kit";
import { resolveDbCredentials } from "./src/lib/db-env";

const creds = resolveDbCredentials();
const isTurso = creds.url.startsWith("libsql://");

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: isTurso ? "turso" : "sqlite",
  dbCredentials: isTurso ? creds : { url: creds.url.replace(/^file:/, "") },
});
