import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
// @ts-ignore
import postgres from "postgres";
import * as process from "node:process";

const migration = async () => {
  console.log("migration started...");

  const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });
  await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });

  console.log("migration complete");
  process.exit(0);
};

migration();
