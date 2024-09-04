import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { columns } from "./columns.schema";

export const boards = pgTable("boards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const boardsRelations = relations(boards, ({ many }) => ({
  columns: many(columns),
}));

export const insertBoardsSchema = createInsertSchema(boards, {
  name: z.string().min(1).max(20),
});
export const selectBoardsSchema = createSelectSchema(boards);
