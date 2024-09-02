import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

import { columns as columnsTable, insertColumnsSchema } from "@/db/schema";
import { db } from "@/db";

export const columnRoutes = new Hono()
  .get("/", async (c) => {
    const columns = await db.select().from(columnsTable);

    c.status(200);
    return c.json({
      success: true,
      data: { columns },
    });
  })
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
  .get(":id{[0-9]+}", async (c) => {
    const id = c.req.param("id");
    const column = await db
      .select()
      .from(columnsTable)
      .where(eq(columnsTable.id, Number(id)));

    c.status(200);
    return c.json({
      success: true,
      data: { column },
    });
  })
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
  .delete(":id{[0-9]+}", async (c) => {
    const id = c.req.param("id");

    await db.delete(columnsTable).where(eq(columnsTable.id, Number(id)));

    c.status(204);
    return c.json({
      success: true,
      data: null,
    });
  });
