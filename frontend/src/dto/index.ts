export interface IBoardDto {
  _id: string;
  name: string;
  columns: IColumnDto[];
}

export interface IColumnDto {
  _id: string;
  name: string;
  tasks: ITaskDto[];
}

export interface ITaskDto {
  _id: string;
  name: string;
  column: string;
}
