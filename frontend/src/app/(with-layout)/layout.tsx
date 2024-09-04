import { DarkModeToggle } from "@/components";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <header className="text-right p-4">
        <DarkModeToggle />
      </header>
      {children}
    </>
  );
};

export default Layout;
