import { useMutation } from "@tanstack/react-query";

import { createColumn, reorderColumns } from "@/api";

export const useReorderColumns = () => {
  return useMutation({
    mutationFn: reorderColumns,
  });
};

export const useCreateColumn = () => {
  return useMutation({
    mutationFn: createColumn,
  });
};
