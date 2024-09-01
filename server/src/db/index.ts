import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { processEnv } from "@/../../env";


const queryClient = postgres(processEnv.DATABASE_URL);
export const db = drizzle(queryClient);