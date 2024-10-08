import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: [
    "./src/db/schema/board.schema.ts",
    "./src/db/schema/column.schema.ts",
    "./src/db/schema/task.schema.ts",
    "./src/db/schema/user.schema.ts",
  ],
  out: "drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
