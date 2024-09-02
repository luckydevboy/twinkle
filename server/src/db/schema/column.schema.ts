import { integer, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { boards } from "./board.schema";
import { tasks } from "./task.schema";

export const columns = pgTable("columns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  boardId: text("board_id").notNull(),
});

export const columnsRelations = relations(columns, ({ one, many }) => ({
  board: one(boards, {
    fields: [columns.boardId],
    references: [boards.id],
  }),
  tasks: many(tasks),
}));

export const insertColumnsSchema = createInsertSchema(columns, {
  name: z.string().min(1).max(20),
  boardId: z.string().nullable(),
});
export const selectColumnsSchema = createSelectSchema(columns);
