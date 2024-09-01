import { Hono } from "hono";
import { logger } from "hono/logger";

import { boardRoutes } from "./routes";

const app = new Hono();

app.use(logger());

const apiRoutes = app.basePath("/api").route("/v1/boards", boardRoutes);

export default app;
export type ApiRoutes = typeof apiRoutes;
