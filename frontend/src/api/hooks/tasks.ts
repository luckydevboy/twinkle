import { useMutation } from "@tanstack/react-query";

import {
  createTask,
  moveTaskToAnotherColumn,
  reorderTasksInColumn,
} from "@/api";

export const useCreateTask = () => {
  return useMutation({
    mutationFn: createTask,
  });
};

export const useReorderTasksInColumn = () => {
  return useMutation({
    mutationFn: reorderTasksInColumn,
  });
};

export const useMoveTaskToAnotherColumn = () => {
  return useMutation({
    mutationFn: moveTaskToAnotherColumn,
  });
};
