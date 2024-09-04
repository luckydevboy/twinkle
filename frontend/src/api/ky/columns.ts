import ky from "ky";

export const createColumn = async (data: { name: string; boardId: number }) => {
  const { name, boardId } = data;

  return await ky.post("api/v1/columns", {
    json: { name, boardId },
  });
};

export const reorderColumns = async (data: {
  boardId: number;
  columnIds: number[];
}) => {
  const { boardId, columnIds } = data;

  return await ky.put(`api/v1/columns/board/${boardId}/reorder`, {
    json: { columnIds },
  });
};
