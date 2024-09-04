import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { columns } from "./columns.schema";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  columnId: integer("column_id").notNull(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  column: one(columns, {
    fields: [tasks.columnId],
    references: [columns.id],
  }),
}));

export const insertTasksSchema = createInsertSchema(tasks, {
  name: z.string().min(1).max(20),
  description: z.string().min(1).max(1000),
  columnId: z.number().int(),
});
export const selectTasksSchema = createSelectSchema(tasks);
