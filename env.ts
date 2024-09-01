import { z } from "zod";

const env = z.object({
  DATABASE_URL: z.string().url(),
  BASE_URL: z.string().url()
});

export const processEnv = env.parse(process.env);