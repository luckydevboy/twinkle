import { Hono } from "hono";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

import { users, userSchema } from "@/db/schema";
import { db } from "@/db";

export const authRoutes = new Hono()
  .post("/register", zValidator("json", userSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
      })
      .returning();

    c.status(201);
    return c.json({
      success: true,
      data: result[0],
    });
  })
  .post("/login", zValidator("json", userSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !(await bcrypt.compare(password, user[0].password))) {
      c.status(401);
      return c.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user[0].id, email: user[0].email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    c.status(200);
    return c.json({
      success: true,
      token,
    });
  })
  .get("/protected", async (c) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
      c.status(401);
      return c.json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return c.json({
        success: true,
        user: decoded,
      });
    } catch (err) {
      c.status(401);
      return c.json({ success: false, message: "Unauthorized" });
    }
  });
