"use client";

import TanstackProvider from "@/providers/TanstackProvider";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TanstackProvider>{children}</TanstackProvider>
    </ThemeProvider>
  );
}
