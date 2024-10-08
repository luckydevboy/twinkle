import { drizzle } from "drizzle-orm/postgres-js";
// @ts-ignore
import postgres from "postgres";
import { z } from "zod";

const PostgresEnv = z.object({
  DATABASE_URL: z.string().url(),
});

const ProcessEnv = PostgresEnv.parse(process.env);

const queryClient = postgres(ProcessEnv.DATABASE_URL);
export const db = drizzle(queryClient);
