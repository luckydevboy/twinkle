export interface IBoard {
  id: number;
  name: string;
  tasks: {
    [key: string]: ITask;
  };
  columns: {
    [key: string]: IColumn;
  };
  columnOrder: number[];
}

export interface IColumn {
  id: number;
  title: string;
  taskIds: number[];
}

export interface ITask {
  id: number;
  content: string;
}

export interface IResponse<T> {
  success: IStatus;
  data: T;
}

export type IStatus = boolean;
