
import { Hono } from "hono";
import { getBoards } from "../controllers";

export const boardRoutes = new Hono()
  .get("/", getBoards)
  // .get("/:id", getBoardById)
  // .post("/", createBoard)
