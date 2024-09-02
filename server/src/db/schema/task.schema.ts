import { pgTable, serial, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { columns } from "./column.schema";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  columnId: text("column_id").notNull(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  column: one(columns, {
    fields: [tasks.columnId],
    references: [columns.id],
  }),
}));

export const insertTasksSchema = createInsertSchema(tasks, {
  name: z.string().min(1).max(20),
  description: z.string().min(1),
  columnId: z.string().nullable,
});
export const selectTasksSchema = createSelectSchema(tasks);
