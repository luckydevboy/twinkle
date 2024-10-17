import { IResponse } from "@/interfaces";
import { BoardDto } from "../dtos";
import { ky } from "@/services";

export const getBoard = (id: number) =>
  ky.get(`api/v1/boards/${id}`).json<IResponse<BoardDto>>();

export const getBoards = () =>
  ky
    .get(`api/v1/boards`)
    .json<{
      status: boolean;
      data: { boards: { name: string; id: number }[] };
    }>();
