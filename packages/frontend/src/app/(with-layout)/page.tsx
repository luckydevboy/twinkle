"use client";

import { useGetBoard } from "@/api";
import { Board } from "@/components";

const Home = () => {
  // TODO: make id to be dynamic
  const { data, isPending, isError, error } = useGetBoard(1);

  if (isPending) {
    return <div className="p-4">Loading...</div>;
  }

  if (isError) {
    return <div className="p-4">Error: {error.message}</div>;
  }

  return <Board board={data} />;
};

export default Home;
