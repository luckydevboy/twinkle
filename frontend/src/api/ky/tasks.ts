import ky from "ky";

export const createTask = async (data: { name: string; columnId: number }) => {
  return await ky.post("api/v1/tasks", { json: data });
};

export const moveTaskToAnotherColumn = async (data: {
  taskId: number;
  newColumnId: number;
  position: number;
}) => {
  const { taskId, newColumnId, position } = data;

  return await ky.put(`api/v1/tasks/${taskId}/move`, {
    json: { newColumnId, position },
  });
};

export const reorderTasksInColumn = async (data: {
  columnId: number;
  taskIds: number[];
}) => {
  const { columnId, taskIds } = data;

  return await ky.put(`api/v1/tasks/${columnId}/reorder`, {
    json: { taskIds },
  });
};
