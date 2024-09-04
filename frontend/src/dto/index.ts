export interface IBoardDto {
  id: number;
  name: string;
  columns: IColumnDto[];
}

export interface IColumnDto {
  id: number;
  name: string;
  boardId: number;
  order: number;
  tasks: ITaskDto[];
}

export interface ITaskDto {
  id: number;
  name: string;
  description: string;
  columnId: number;
}
