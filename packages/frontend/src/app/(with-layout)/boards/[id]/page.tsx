"use client";

import { useGetBoard } from "@/services";
import { Board } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

const BoardPage = () => {
  const params = useParams();
  const { data, isPending, isError, error } = useGetBoard(
    Number(Number(params.id)),
  );

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
