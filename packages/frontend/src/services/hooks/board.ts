import { useQuery } from "@tanstack/react-query";

import { getBoard, getBoards } from "@/services";
import { mapBoardFromDto } from "../mappers";

export const useGetBoard = (id: number) => {
  return useQuery({
    queryKey: ["boards", id],
    queryFn: () => getBoard(id),
    select: (res) => mapBoardFromDto(res.data),
  });
};

export const useGetBoards = () =>
  useQuery({
    queryKey: ["boards"],
    queryFn: getBoards,
    select: (res) => res.data.boards,
  });
