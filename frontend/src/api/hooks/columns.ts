import { useMutation } from "@tanstack/react-query";

import { createColumn, reorderColumns } from "@/api";

export const useReorderColumns = () => {
  return useMutation({
    mutationFn: (data: { boardId: string; columnIds: string[] }) =>
      reorderColumns(data.boardId, data.columnIds),
  });
};

export const useCreateColumn = () => {
  return useMutation({
    mutationFn: (data: { boardId: string; name: string }) =>
      createColumn(data.boardId, data.name),
  });
};
