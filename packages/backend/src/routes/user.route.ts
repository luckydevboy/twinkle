import { Hono } from "hono";

import { db } from "@/db";
import { user as userTable } from "@/db/schema";

export const userRoutes = new Hono().get("/", async (c) => {
  const users = await db
    .select({
      id: userTable.id,
      email: userTable.email,
      firstName: userTable.firstName,
      lastName: userTable.lastName,
    })
    .from(userTable);

  return c.json(
    {
      status: true,
      data: users,
    },
    200,
  );
});
