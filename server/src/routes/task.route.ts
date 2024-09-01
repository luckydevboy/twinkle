import { Hono } from "hono";

import {
  getTasksByColumnId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  reorderTasksInColumn,
  moveTaskToAnotherColumn,
} from "../controllers";

export const taskRoutes = new Hono()
  .get("/column/:columnId", getTasksByColumnId)
  .get("/:taskId", getTaskById)
  .post("/", createTask)
  .put("/:taskId", updateTask)
  .delete("/:taskId", deleteTask)
  .put("/:columnId/reorder", reorderTasksInColumn)
  .put("/:taskId/move", moveTaskToAnotherColumn)
