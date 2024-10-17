import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import type { JwtVariables } from "hono/jwt";

import {
  board as boardsTable,
  insertBoardSchema,
  column as columnsTable,
  task as tasksTable,
  user as userTable,
} from "@/db/schema";
import { db } from "@/db";

// TODO: declare Variables in a separate file
type Variables = JwtVariables<{ id: number; email: string }>;

export const boardRoutes = new Hono<{ Variables: Variables }>()
  // Create board
  .post("/", zValidator("json", insertBoardSchema), async (c) => {
    const board = c.req.valid("json");
    const userId = c.get("jwtPayload").id;

    const result = await db
      .insert(boardsTable)
      .values({ ...board, userId })
      .returning({ name: boardsTable.name });

    c.status(201);
    return c.json({
      success: true,
      data: {
        board: result,
      },
    });
  })
  .get("/", async (c) => {
    try {
      const userId = c.get("jwtPayload").id;

      const boards = await db
        .select()
        .from(boardsTable)
        .where(eq(boardsTable.userId, userId));

      return c.json({ success: true, data: { boards } });
    } catch (e: any) {
      return c.json({ success: false, message: e });
    }
  })
  // Get board by ID
  .get(":id{[0-9]+}", async (c) => {
    const id = c.req.param("id");
    const board = await db
      .select()
      .from(boardsTable)
      .where(eq(boardsTable.id, Number(id)))
      .limit(1);

    if (!board.length) {
      c.status(404);
      return c.json({
        success: false,
        message: "Board not found!",
      });
    }

    // Fetch the columns related to the board
    const columns = await db
      .select()
      .from(columnsTable)
      .where(eq(columnsTable.boardId, Number(id)));

    // Fetch the tasks related to each column
    const columnsWithTasks = await Promise.all(
      columns.map(async (column) => {
        const tasks = await db
          .select({
            id: tasksTable.id,
            name: tasksTable.name,
            description: tasksTable.description,
            columnId: tasksTable.columnId,
            user: {
              id: tasksTable.userId,
              firstName: userTable.firstName,
              lastName: userTable.lastName,
            },
            order: tasksTable.order,
          })
          .from(tasksTable)
          .leftJoin(userTable, eq(tasksTable.userId, userTable.id))
          .where(eq(tasksTable.columnId, column.id));

        return {
          ...column,
          tasks,
        };
      }),
    );

    c.status(200);
    return c.json({
      success: true,
      data: { id: board[0].id, name: board[0].name, columns: columnsWithTasks },
    });
  })
  // Update board by ID
  .put("/:id{[0-9]+}", zValidator("json", insertBoardSchema), async (c) => {
    const id = c.req.param("id");
    const board = c.req.valid("json");

    await db
      .update(boardsTable)
      .set(board)
      .where(eq(boardsTable.id, Number(id)));

    c.status(201);
    return c.json({
      success: true,
      data: { board },
    });
  })
  // Delete board by ID
  .delete(":id{[0-9]+}", async (c) => {
    const id = c.req.param("id");

    await db.delete(boardsTable).where(eq(boardsTable.id, Number(id)));

    c.status(204);
    return c.json({
      success: true,
      data: null,
    });
  });
