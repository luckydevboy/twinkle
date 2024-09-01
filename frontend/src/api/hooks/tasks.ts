import { useMutation } from "@tanstack/react-query";

import {
  createTask,
  moveTaskToAnotherColumn,
  reorderTasksInColumn,
} from "@/api";

export const useCreateTask = () => {
  return useMutation({
    mutationFn: (data: { name: string; columnId: string }) =>
      createTask(data.name, data.columnId),
  });
};

export const useReorderTasksInColumn = () => {
  return useMutation({
    mutationFn: (data: { columnId: string; taskIds: string[] }) =>
      reorderTasksInColumn(data.columnId, data.taskIds),
  });
};

export const useMoveTaskToAnotherColumn = () => {
  return useMutation({
    mutationFn: (data: {
      taskId: string;
      newColumnId: string;
      position: number;
    }) => moveTaskToAnotherColumn(data.taskId, data.newColumnId, data.position),
  });
};
