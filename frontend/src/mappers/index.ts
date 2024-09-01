import { IBoardDto } from "@/dto";
import { IBoard, IColumn, ITask } from "@/interfaces";

export const mapBoardFromDto = (board: IBoardDto): IBoard => {
  const tasks: { [key: string]: ITask } = {};
  const columns: { [key: string]: IColumn } = {};
  const columnOrder: string[] = [];

  board.columns.forEach((column) => {
    columns[column._id] = { id: column._id, title: column.name, taskIds: [] };

    columnOrder.push(column._id);

    column.tasks.forEach((task) => {
      tasks[task._id] = { id: task._id, content: task.name };
      columns[column._id].taskIds.push(task._id);
    });
  });

  return {
    name: board.name,
    id: board._id,
    tasks,
    columns,
    columnOrder,
  };
};

export const mapBoardToDto = (board: IBoard): IBoardDto => {
  return {
    _id: board.id,
    name: board.name,
    columns: board.columnOrder.map((colId) => ({
      _id: colId,
      name: board.columns[colId].title,
      tasks: board.columns[colId].taskIds.map((taskId) => ({
        _id: taskId,
        name: board.tasks[taskId].content,
        column: colId,
      })),
    })),
  };
};
