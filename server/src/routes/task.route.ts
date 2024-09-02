import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

import { tasks as tasksTable, insertTasksSchema } from "@/db/schema";
import { db } from "@/db";

export const taskRoutes = new Hono()
  .get("/", async (c) => {
    const tasks = await db.select().from(tasksTable);

    c.status(200);
    return c.json({
      success: true,
      data: { tasks },
    });
  })
  .post("/", zValidator("json", insertTasksSchema), async (c) => {
    const task = c.req.valid("json");

    const result = await db.insert(tasksTable).values(task).returning();

    c.status(201);
    return c.json({
      success: true,
      data: {
        task: result,
      },
    });
  })
  .get(":id{[0-9]+}", async (c) => {
    const id = c.req.param("id");
    const task = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.id, Number(id)));

    c.status(200);
    return c.json({
      success: true,
      data: { task },
    });
  })
  .put("/:id{[0-9]+}", zValidator("json", insertTasksSchema), async (c) => {
    const id = c.req.param("id");
    const task = c.req.valid("json");

    await db
      .update(tasksTable)
      .set(task)
      .where(eq(tasksTable.id, Number(id)));

    c.status(201);
    return c.json({
      success: true,
      data: { task },
    });
  })
  .delete(":id{[0-9]+}", async (c) => {
    const id = c.req.param("id");

    await db.delete(tasksTable).where(eq(tasksTable.id, Number(id)));

    c.status(204);
    return c.json({
      success: true,
      data: null,
    });
  });
