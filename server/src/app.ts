import { Hono } from "hono";
import { logger } from 'hono/logger'

import { boardRoutes, columnRoutes } from "./routes";

const app = new Hono();

app.use(logger());

const apiRoutes = app.basePath("/api")
  .route("/v1/boards", boardRoutes)
// .route("/v1", columnRoutes)

export default app;
export type ApiRoutes = typeof apiRoutes;

