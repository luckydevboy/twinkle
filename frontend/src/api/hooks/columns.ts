import { useMutation } from "@tanstack/react-query";

import { createColumn, editColumn, reorderColumns } from "@/api";

export const useReorderColumns = () => {
  return useMutation({
    mutationFn: reorderColumns,
  });
};

export const useEditColumn = () => useMutation({ mutationFn: editColumn });

export const useCreateColumn = () => {
  return useMutation({
    mutationFn: createColumn,
  });
};
