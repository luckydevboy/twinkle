import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { board } from "./board.schema";
import { task } from "./task.schema";

export const column = pgTable("column", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  boardId: integer("board_id").notNull(),
  order: integer("order").notNull(),
});

export const columnRelations = relations(column, ({ one, many }) => ({
  board: one(board, {
    fields: [column.boardId],
    references: [board.id],
  }),
  tasks: many(task),
}));

export const insertColumnSchema = createInsertSchema(column, {
  name: z.string().min(1).max(20),
  boardId: z.number().int(),
  order: z.number().int(),
});
export const selectColumnSchema = createSelectSchema(column);
