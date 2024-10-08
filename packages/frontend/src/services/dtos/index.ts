export interface BoardDto {
  id: number;
  name: string;
  columns: ColumnDto[];
}

export interface ColumnDto {
  id: number;
  name: string;
  boardId: number;
  order: number;
  tasks: TaskDto[];
}

export interface TaskDto {
  id: number;
  name: string;
  description: string;
  columnId: number;
  order: number;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ResponseDto<T> {
  success: boolean;
  data: T;
}

export interface AuthResponseDto {
  success: boolean;
  token: string;
}
