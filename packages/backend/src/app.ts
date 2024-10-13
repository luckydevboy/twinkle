import { Hono } from "hono";
import { logger } from "hono/logger";
import { jwt } from "hono/jwt";
import { cors } from "hono/cors";

import {
  authRoutes,
  boardRoutes,
  columnRoutes,
  taskRoutes,
  userRoutes,
} from "./routes";

const app = new Hono();

app.use(logger());

app.use(
  "/api/v1/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

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

app.use(
  "/api/v1/users/*",
  jwt({
    secret: process.env.JWT_SECRET!,
  }),
);

const apiRoutes = app
  .basePath("/api")
  .route("/v1/boards", boardRoutes)
  .route("/v1/columns", columnRoutes)
  .route("/v1/tasks", taskRoutes)
  .route("/v1/auth", authRoutes)
  .route("/v1/users", userRoutes);

export default app;
export type ApiRoutes = typeof apiRoutes;
