export interface IBoard {
  id: string;
  name: string;
  tasks: {
    [key: string]: ITask;
  };
  columns: {
    [key: string]: IColumn;
  };
  columnOrder: string[];
}

export interface IColumn {
  id: string;
  title: string;
  taskIds: string[];
}

export interface ITask {
  id: string;
  content: string;
}

export interface IResponse<T> {
  status: IStatus;
  data: {
    [key: string]: T;
  };
}

export type IStatus = "success" | "fail";
