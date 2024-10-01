import ky from "ky";

import { IResponse } from "@/interfaces";
import { IBoardDto } from "../dto";

export const getBoard = (id: number) =>
  ky.get(`api/v1/boards/${id}`).json<IResponse<IBoardDto>>();
