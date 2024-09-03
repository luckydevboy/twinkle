import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: [
    "./server/src/db/schema/board.schema.ts",
    "./server/src/db/schema/column.schema.ts",
    "./server/src/db/schema/task.schema.ts",
  ],
  out: "drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
