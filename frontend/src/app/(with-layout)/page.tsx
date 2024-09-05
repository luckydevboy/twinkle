"use client";

import { useGetBoard } from "@/api";
import { Board } from "@/components";
import { ApiRoutes } from "server/app";

const Home = () => {
  // TODO: make id to be dynamic
  const { data, isPending, isError, error } = useGetBoard(1);

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return <Board board={data} />;
};

export default Home;
