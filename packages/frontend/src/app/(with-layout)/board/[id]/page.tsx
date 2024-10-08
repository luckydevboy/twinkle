"use client";

import { useGetBoard } from "@/services";
import { Board } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";

const BoardPage = () => {
  const { data, isPending, isError, error } = useGetBoard(1);

  if (isPending) {
    return (
      <div className="px-4 flex gap-x-4">
        <Skeleton className="w-80 h-48 rounded-lg" />
        <Skeleton className="w-80 h-80 rounded-lg" />
        <Skeleton className="w-80 h-56 rounded-lg" />
      </div>
    );
  }

  if (isError) {
    return <div className="p-4">Error: {error.message}</div>;
  }

  return <Board board={data} />;
};

export default BoardPage;
