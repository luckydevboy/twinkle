import { ky } from "@/services";
import { ResponseDto, UserDto } from "../dtos";

export const getUsers = () =>
  ky.get<ResponseDto<UserDto[]>>("api/v1/users").json();
