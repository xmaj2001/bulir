import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Qcena | Serviços sem complicação",
  description:
    "A plataforma completa para gerenciar seus serviços com agilidade e transparência.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Providers>
          <SessionProvider>{children}</SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
