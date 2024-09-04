import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { boards } from "./boards.schema";
import { tasks } from "./tasks.schema";

export const columns = pgTable("columns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  boardId: integer("board_id").notNull(),
  order: integer("order").notNull(),
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
  boardId: z.number().int(),
});
export const selectColumnsSchema = createSelectSchema(columns);
