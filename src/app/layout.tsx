import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppProviders } from "@/components/layout/providers";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Genesis | AcelerIA - Orquestador de proyectos",
  description:
    "AcelerIA Genesis transforma ideas en planes accionables con cadenas de agentes de IA y un panel de misión colaborativo.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground",
          inter.variable,
        )}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
