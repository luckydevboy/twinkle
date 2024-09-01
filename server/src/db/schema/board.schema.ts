import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { columns } from './column.schema'

export const boards = pgTable('boards', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const boardsRelations = relations(boards, ({ many }) => ({
  columns: many(columns)
}));