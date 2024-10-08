import { IResponse } from "@/interfaces";
import { BoardDto } from "../dtos";
import { ky } from "@/services";

export const getBoard = (id: number) =>
  ky.get(`api/v1/boards/${id}`).json<IResponse<BoardDto>>();
