import { ReactNode } from "react";

import { DarkModeToggle, Separator } from "@/components";

const Layout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <>
      <header className="flex items-center justify-between p-4">
        <h1 className="font-black text-xl">Twinkle</h1>
        <DarkModeToggle />
      </header>
      <Separator className="mb-4" />
      {children}
    </>
  );
};

export default Layout;
