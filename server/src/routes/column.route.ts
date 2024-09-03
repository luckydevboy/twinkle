import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

import { columns as columnsTable, insertColumnsSchema } from "@/db/schema";
import { boards as boardsTable } from "@/db/schema";
import { db } from "@/db";
import { z } from "zod";

export const columnRoutes = new Hono()
  // Get columns of a specific board
  .get("board/:boardId{[0-9]+}", async (c) => {
    const boardId = c.req.param("boardId");

    const columns = await db
      .select()
      .from(columnsTable)
      .where(eq(columnsTable.boardId, boardId));

    c.status(200);
    return c.json({
      success: true,
      data: { columns },
    });
  })
  // Create new column
  .post("/", zValidator("json", insertColumnsSchema), async (c) => {
    const column = c.req.valid("json");

    const result = await db.insert(columnsTable).values(column).returning();

    c.status(201);
    return c.json({
      success: true,
      data: {
        column: result,
      },
    });
  })
  // Update a column
  .put("/:id{[0-9]+}", zValidator("json", insertColumnsSchema), async (c) => {
    const id = c.req.param("id");
    const column = c.req.valid("json");

    await db
      .update(columnsTable)
      .set(column)
      .where(eq(columnsTable.id, Number(id)));

    c.status(201);
    return c.json({
      success: true,
      data: { column },
    });
  })
  // delete a column
  .delete(":id{[0-9]+}", async (c) => {
    const id = c.req.param("id");

    await db.delete(columnsTable).where(eq(columnsTable.id, Number(id)));

    c.status(204);
    return c.json({
      success: true,
      data: null,
    });
  })
  // Reorder columns in a board
  .put(
    "board/:boardId{[0-9]+}/reorder",
    zValidator("json", z.object({ columnIds: z.array(z.number()) })),
    async (c) => {
      const boardId = c.req.param("boardId");
      const { columnIds } = await c.req.valid("json");

      const columns = await db
        .select()
        .from(columnsTable)
        .where(eq(columnsTable.boardId, Number(boardId)));

      const validColumnIds = columns.map((column) => column.id);
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
            .update(columnsTable)
            .set({ order: index + 1 })
            .where(eq(columnsTable.id, Number(columnId))),
        ),
      );

      c.status(201);
      return c.json({
        success: true,
        message: "Columns reordered successfully.",
      });
    },
  );
