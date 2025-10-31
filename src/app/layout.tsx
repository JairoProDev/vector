import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppProviders } from "@/components/layout/providers";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "VECTOR | Mission Orchestrator",
  description:
    "VECTOR transforma ideas en planes accionables: coordina agentes de IA, genera artefactos estratégicos y te entrega una misión lista para ejecutar.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
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
