import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: [
    "./server/src/db/schema/boards.schema.ts",
    "./server/src/db/schema/columns.schema.ts",
    "./server/src/db/schema/tasks.schema.ts",
  ],
  out: "drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
