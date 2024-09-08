import ky from "ky";

export const createColumn = (data: { name: string; boardId: number }) => {
  const { name, boardId } = data;

  return ky.post("api/v1/columns", {
    json: { name, boardId },
  });
};

export const reorderColumns = (data: {
  boardId: number;
  columnIds: number[];
}) => {
  const { boardId, columnIds } = data;

  return ky.put(`api/v1/columns/board/${boardId}/reorder`, {
    json: { columnIds },
  });
};
