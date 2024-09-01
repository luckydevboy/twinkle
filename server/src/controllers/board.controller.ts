import { Context } from "hono";

import { db } from "@/db";
import { boards as boardsTable } from "@/db/schema";

export const getBoards = async (c: Context) => {
  const boards = await db.select().from(boardsTable);

  return c.json({
    status: 'success',
    data: { boards }
  })
};
