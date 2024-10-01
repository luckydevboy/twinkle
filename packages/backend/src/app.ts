import { Hono } from "hono";
import { logger } from "hono/logger";

import { boardRoutes, columnRoutes, taskRoutes } from "./routes";

const app = new Hono();

app.use(logger());

const apiRoutes = app
  .basePath("/api")
  .route("/v1/boards", boardRoutes)
  .route("/v1/columns", columnRoutes)
  .route("/v1/tasks", taskRoutes);

export default app;
export type ApiRoutes = typeof apiRoutes;
