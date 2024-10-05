import ky from "ky";

import { IColumnDto, IResponseDto } from "../dtos";

export const createColumn = (data: {
  name: string;
  boardId: number;
  order: number;
}) => {
  return ky
    .post<IResponseDto<Omit<IColumnDto, "tasks">>>("api/v1/columns", {
      json: data,
    })
    .json();
};

export const editColumn = (data: { columnId: number; name: string }) => {
  const { columnId, name } = data;
  return ky.put(`api/v1/columns/${columnId}`, { json: { name } }).json();
};

export const deleteColumn = (id: number) => ky.delete(`api/v1/columns/${id}`);

export const reorderColumns = (data: {
  boardId: number;
  columnIds: number[];
}) => {
  const { boardId, columnIds } = data;

  return ky.put(`api/v1/columns/board/${boardId}/reorder`, {
    json: { columnIds },
  });
};
