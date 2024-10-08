import { AuthResponseDto } from "../dtos";
import { ky } from "@/services";

export const login = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) =>
  ky
    .post<AuthResponseDto>("api/v1/auth/login", { json: { email, password } })
    .json();

export const register = ({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) =>
  ky
    .post<AuthResponseDto>("api/v1/auth/register", {
      json: { email, password, firstName, lastName },
    })
    .json();
