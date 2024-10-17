"use client";

import { useGetBoards } from "@/services";
import { Card, CardHeader, CardTitle, Skeleton } from "@/components";
import Link from "next/link";

const Boards = () => {
  const { data, isPending } = useGetBoards();

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-4">
      {data?.map((board) => (
        <Link href={`/boards/${board.id}`} key={board.id}>
          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle>{board.name}</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default Boards;
