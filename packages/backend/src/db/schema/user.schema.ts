import { z } from "zod";
import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
