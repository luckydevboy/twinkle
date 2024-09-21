import { IBoardDto } from "@/api/dto";
import { IBoard, IColumn, ITask } from "@/interfaces";

export const mapBoardFromDto = (board: IBoardDto): IBoard => {
  const tasks: { [key: string]: ITask } = {};
  const columns: { [key: string]: IColumn } = {};
  const columnOrder: number[] = [];

  board.columns.forEach((column) => {
    columns[column.id] = { id: column.id, title: column.name, taskIds: [] };

    columnOrder[column.order - 1] = column.id;

    column.tasks.forEach((task) => {
      tasks[task.id] = { id: task.id, content: task.name };
      columns[column.id].taskIds[task.order] = task.id;
    });
    columns[column.id].taskIds = columns[column.id].taskIds.filter((id) => id);
  });

  return {
    name: board.name,
    id: board.id,
    tasks,
    columns,
    columnOrder,
  };
};
