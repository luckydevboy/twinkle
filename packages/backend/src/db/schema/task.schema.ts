import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { column } from "./column.schema";

export const task = pgTable("task", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  columnId: integer("column_id").notNull(),
  order: integer("order").notNull(),
});

export const taskRelations = relations(task, ({ one }) => ({
  column: one(column, {
    fields: [task.columnId],
    references: [column.id],
  }),
}));

export const insertTasksSchema = createInsertSchema(task, {
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  columnId: z.number().int(),
  order: z.number().int(),
});
export const selectTasksSchema = createSelectSchema(task);
