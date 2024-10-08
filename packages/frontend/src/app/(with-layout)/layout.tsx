"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { Button, DarkModeToggle, Separator } from "@/components";

const Layout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth?type=login");
  };

  return (
    <>
      <header className="flex items-center justify-between p-4">
        <h1 className="font-black text-xl">Twinkle</h1>
        <div className="flex items-center gap-x-2">
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
          <DarkModeToggle />
        </div>
      </header>
      <Separator className="mb-4" />
      {children}
    </>
  );
};

export default Layout;
