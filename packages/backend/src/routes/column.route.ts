import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  column as columnTable,
  insertColumnSchema,
  task as taskTable,
} from "@/db/schema";
import { db } from "@/db";

export const columnRoutes = new Hono()
  // Get column of a specific board
  .get("board/:boardId{[0-9]+}", async (c) => {
    const boardId = c.req.param("boardId");

    const column = await db
      .select()
      .from(columnTable)
      .where(eq(columnTable.boardId, Number(boardId)));

    c.status(200);
    return c.json({
      success: true,
      data: { column },
    });
  })
  // Create new column
  .post("/", zValidator("json", insertColumnSchema), async (c) => {
    const column = c.req.valid("json");

    const result = await db.insert(columnTable).values(column).returning();

    c.status(201);
    return c.json({
      success: true,
      data: result[0],
    });
  })
  // Update column
  .put(
    "/:id{[0-9]+}",
    zValidator("json", z.object({ name: z.string() })),
    async (c) => {
      const id = c.req.param("id");
      const column = c.req.valid("json");

      await db
        .update(columnTable)
        .set(column)
        .where(eq(columnTable.id, Number(id)));

      c.status(201);
      return c.json({
        success: true,
        data: { column },
      });
    },
  )
  // delete a column and its tasks
  .delete(":id{[0-9]+}", async (c) => {
    const id = c.req.param("id");

    await db.delete(taskTable).where(eq(taskTable.columnId, Number(id)));

    await db.delete(columnTable).where(eq(columnTable.id, Number(id)));

    c.status(204);
    return c.json({
      success: true,
      data: null,
    });
  })
  // Reorder column in a board
  .put(
    "board/:boardId{[0-9]+}/reorder",
    zValidator("json", z.object({ columnIds: z.array(z.number()) })),
    async (c) => {
      const boardId = c.req.param("boardId");
      const { columnIds } = c.req.valid("json");

      const column = await db
        .select()
        .from(columnTable)
        .where(eq(columnTable.boardId, Number(boardId)));

      const validColumnIds = column.map((column) => column.id);
      const isValid = columnIds.every((id) => validColumnIds.includes(id));

      if (!isValid) {
        c.status(400);
        return c.json({
          success: false,
          message: "Invalid column IDs provided",
        });
      }

      await Promise.all(
        columnIds.map((columnId, index) =>
          db
            .update(columnTable)
            .set({ order: index + 1 })
            .where(eq(columnTable.id, Number(columnId))),
        ),
      );

      c.status(201);
      return c.json({
        success: true,
        message: "Column reordered successfully.",
      });
    },
  );
