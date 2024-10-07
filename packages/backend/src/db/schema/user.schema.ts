import { z } from "zod";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { board } from "./board.schema";

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  boards: many(board),
}));

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
