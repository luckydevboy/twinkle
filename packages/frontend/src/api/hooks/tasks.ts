import { useMutation } from "@tanstack/react-query";

import {
  createTask,
  deleteTask,
  editTask,
  moveTaskToAnotherColumn,
  reorderTasksInColumn,
} from "@/api";

export const useCreateTask = () => {
  return useMutation({
    mutationFn: createTask,
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: deleteTask,
  });
};

export const useEditTask = () =>
  useMutation({
    mutationFn: editTask,
  });

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
