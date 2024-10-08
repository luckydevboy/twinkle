import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/https/user";

export const useGetUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    select: (res) => res.data,
  });
