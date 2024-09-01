import { pgTable, serial, text, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { boards } from './board.schema'
import { tasks } from './task.schema'

export const columns = pgTable('columns', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  boardId: uuid('board_id').notNull()
});

export const columnsRelations = relations(columns, ({ one, many }) => ({
  board: one(boards, {
    fields: [columns.boardId],
    references: [boards.id],
  }),
  tasks: many(tasks)
}));