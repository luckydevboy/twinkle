import { useGetBoard } from "@/api";
import { Board } from "@/components";

const Home = () => {
  const { data: board } = useGetBoard("66c4f7ead5c1d961c5923b68");

  if (board) return <Board board={board} />;
  else return <></>;
};

export default Home;
