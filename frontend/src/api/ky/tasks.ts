import ky from "ky";

export const createTask = (data: {
  name: string;
  columnId: number;
  order: number;
}) => {
  return ky.post("api/v1/tasks", { json: data });
};

export const deleteTask = async (id: number) => {
  return ky.delete(`api/v1/tasks/${id}`);
};

export const moveTaskToAnotherColumn = async (data: {
  taskId: number;
  newColumnId: number;
  newPosition: number;
}) => {
  const { taskId, newColumnId, newPosition } = data;

  return ky.put(`api/v1/tasks/move/${taskId}/to/${newColumnId}`, {
    json: { newPosition },
  });
};

export const reorderTasksInColumn = async (data: {
  columnId: number;
  taskIds: number[];
}) => {
  const { columnId, taskIds } = data;

  return ky.put(`api/v1/tasks/${columnId}/reorder`, {
    json: { taskIds },
  });
};
