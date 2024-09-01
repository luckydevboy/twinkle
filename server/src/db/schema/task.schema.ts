import { pgTable, serial, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { columns } from "./column.schema";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  columnId: uuid("column_id").notNull(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  column: one(columns, {
    fields: [tasks.columnId],
    references: [columns.id],
  }),
}));
