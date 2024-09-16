import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { task as taskTable, insertTasksSchema } from "@/db/schema";
import { db } from "@/db";

export const taskRoutes = new Hono()
  .get("/", async (c) => {
    const task = await db.select().from(taskTable);

    c.status(200);
    return c.json({
      success: true,
      data: { task },
    });
  })
  .post("/", zValidator("json", insertTasksSchema), async (c) => {
    const task = c.req.valid("json");

    const result = await db.insert(taskTable).values(task).returning();

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
      .from(taskTable)
      .where(eq(taskTable.id, Number(id)));

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
      .update(taskTable)
      .set(task)
      .where(eq(taskTable.id, Number(id)));

    c.status(201);
    return c.json({
      success: true,
      data: { task },
    });
  })
  .delete(":id{[0-9]+}", async (c) => {
    const id = c.req.param("id");

    await db.delete(taskTable).where(eq(taskTable.id, Number(id)));

    c.status(204);
    return c.json({
      success: true,
      data: null,
    });
  })
  .put(
    "/:columnId{[0-9]+}/reorder",
    zValidator("json", z.object({ taskIds: z.array(z.number().int()) })),
    async (c) => {
      const columnId = c.req.param("columnId");
      const { taskIds } = c.req.valid("json");

      const tasks = await db
        .select()
        .from(taskTable)
        .where(eq(taskTable.columnId, Number(columnId)));

      const validTaskIds = tasks.map((task) => task.id);

      const isValid = taskIds.every((taskId) => validTaskIds.includes(taskId));

      if (!isValid) {
        c.status(400);
        return c.json({
          success: false,
          message: "Invalid task IDs provided!",
        });
      }

      await Promise.all(
        taskIds.map((taskId, index) =>
          db
            .update(taskTable)
            .set({ order: index + 1 })
            .where(eq(taskTable.id, Number(taskId))),
        ),
      );

      c.status(201);
      return c.json({
        success: true,
        message: "Tasks reordered successfully.",
      });
    },
  )
  .put("/move/:taskId{[0-9]+}/to/:newColumnId{[0-9]+}", async (c) => {
    const taskId = c.req.param("taskId");
    const newColumnId = c.req.param("newColumnId");

    // Fetch the task to ensure it exists
    const task = await db
      .select()
      .from(taskTable)
      .where(eq(taskTable.id, Number(taskId)))
      .limit(1);

    if (task.length === 0) {
      c.status(404);
      return c.json({
        success: false,
        message: "Task not found",
      });
    }

    // Update the task's columnId to move it to the new column
    await db
      .update(taskTable)
      .set({ columnId: Number(newColumnId) })
      .where(eq(taskTable.id, Number(taskId)));

    c.status(200);
    return c.json({
      success: true,
      message: "Task moved successfully",
    });
  });
