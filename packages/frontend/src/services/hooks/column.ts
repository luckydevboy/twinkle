import { useMutation } from "@tanstack/react-query";

import {
  createColumn,
  deleteColumn,
  editColumn,
  reorderColumns,
} from "@/services";

export const useReorderColumns = () => {
  return useMutation({
    mutationFn: reorderColumns,
  });
};

export const useEditColumn = () => useMutation({ mutationFn: editColumn });

export const useDeleteColumn = () => useMutation({ mutationFn: deleteColumn });

export const useCreateColumn = () => {
  return useMutation({
    mutationFn: createColumn,
  });
};
