import { Hono } from "hono";
import { logger } from "hono/logger";
import { jwt } from "hono/jwt";

import { authRoutes, boardRoutes, columnRoutes, taskRoutes } from "./routes";
import * as process from "node:process";

const app = new Hono();

app.use(logger());

app.use(
  "/api/v1/boards/*",
  jwt({
    secret: process.env.JWT_SECRET!,
  }),
);

app.use(
  "/api/v1/columns/*",
  jwt({
    secret: process.env.JWT_SECRET!,
  }),
);

app.use(
  "/api/v1/boards/*",
  jwt({
    secret: process.env.JWT_SECRET!,
  }),
);

const apiRoutes = app
  .basePath("/api")
  .route("/v1/boards", boardRoutes)
  .route("/v1/columns", columnRoutes)
  .route("/v1/tasks", taskRoutes)
  .route("/v1/auth", authRoutes);

export default app;
export type ApiRoutes = typeof apiRoutes;
