// In Next.js, this file would be called: app/providers.jsx
"use client";

import { ReactNode } from "react";
import ReactQueryProvider from "./react-query-provider";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
