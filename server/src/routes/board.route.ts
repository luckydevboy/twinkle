import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { boards as boardsTable, insertBoardsSchema } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export const boardRoutes = new Hono()
  .get("/", async (c) => {
    const boards = await db.select().from(boardsTable);

    c.status(200);
    return c.json({
      status: "success",
      data: { boards },
    });
  })
  .post("/", zValidator("json", insertBoardsSchema), async (c) => {
    const board = c.req.valid("json");

    const result = await db.insert(boardsTable).values(board).returning();

    c.status(201);
    return c.json({
      status: "success",
      data: {
        board: result,
      },
    });
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const board = await db
      .select()
      .from(boardsTable)
      .where(eq(boardsTable.id, Number(id)));

    c.status(200);
    return c.json({
      status: "success",
      data: { board },
    });
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");

    await db.delete(boardsTable).where(eq(boardsTable.id, Number(id)));

    c.status(204);
    return c.json({
      status: "success",
      data: null,
    });
  });
