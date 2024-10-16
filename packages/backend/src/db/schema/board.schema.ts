import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { column } from "./column.schema";
import { user } from "./user.schema";

export const board = pgTable("board", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id"),
});

export const boardRelations = relations(board, ({ many, one }) => ({
  columns: many(column),
  user: one(user, {
    fields: [board.userId],
    references: [user.id],
  }),
}));

export const insertBoardSchema = createInsertSchema(board, {
  name: z.string().min(1).max(20),
  userId: z.undefined(),
});
export const selectBoardSchema = createSelectSchema(board);
