import { Hono } from "hono";
// @ts-ignore
import bcrypt from "bcrypt";
// @ts-ignore
import jwt from "jsonwebtoken";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

import { loginSchema, user, userSchema } from "@/db/schema";
import { db } from "@/db";

export const authRoutes = new Hono()
  .post("/register", zValidator("json", userSchema), async (c) => {
    try {
      const { email, password, firstName, lastName } = c.req.valid("json");

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await db
        .insert(user)
        .values({
          email,
          firstName,
          lastName,
          password: hashedPassword,
        })
        .returning({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        });

      const token = jwt.sign(
        { id: result[0].id, email: result[0].email },
        process.env.JWT_SECRET,
      );

      c.status(201);
      return c.json({
        success: true,
        token,
      });
    } catch (e: any) {
      return c.json(
        {
          success: false,
          message: e.message,
        },
        500,
      );
    }
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const _user = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!_user || !(await bcrypt.compare(password, _user[0].password))) {
      c.status(401);
      return c.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: _user[0].id, email: _user[0].email },
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
  });
