import { useQuery } from "@tanstack/react-query";

import { getBoard } from "@/services";
import { mapBoardFromDto } from "../mappers";

export const useGetBoard = (id: number) => {
  return useQuery({
    queryKey: ["boards", id],
    queryFn: () => getBoard(id),
    select: (res) => mapBoardFromDto(res.data),
  });
};
