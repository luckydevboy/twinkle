import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: [
    "./src/db/schema/boards.schema.ts",
    "./src/db/schema/columns.schema.ts",
    "./src/db/schema/tasks.schema.ts",
  ],
  out: "drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
