import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { column } from "./column.schema";

export const board = pgTable("board", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const boardRelations = relations(board, ({ many }) => ({
  columns: many(column),
}));

export const insertBoardSchema = createInsertSchema(board, {
  name: z.string().min(1).max(20),
});
export const selectBoardSchema = createSelectSchema(board);
