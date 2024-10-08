"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Input,
  Button,
} from "@/components";
import { useLogin, useRegister } from "@/services";
import { AuthResponseDto } from "@/services/dtos";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Auth = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const isLogin = type === "login" || type === null;
  const login = useLogin();
  const register = useRegister();
  const router = useRouter();
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const handleResponse = (res: AuthResponseDto) => {
    router.push("/board/1");
    localStorage.setItem("token", res.token);
  };

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    if (isLogin) {
      login.mutateAsync(data).then((res) => {
        handleResponse(res);
      });
    } else {
      register.mutateAsync(data).then((res) => {
        handleResponse(res);
      });
    }
  };

  return (
    <div className="mx-auto max-w-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className="mb-6 font-black text-4xl text-center">Twinkle</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isLogin ? "Login" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your email below to login to your account"
              : "Enter your information to create an account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      placeholder="Max"
                      {...registerForm("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      placeholder="Robinson"
                      {...registerForm("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...registerForm("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {errors.email?.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  {...registerForm("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                isLoading={register.isPending || login.isPending}
              >
                {isLogin ? "Login" : "Create an account"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <Link href="?type=register" className="underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="?type=login" className="underline">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
