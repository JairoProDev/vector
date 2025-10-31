"use client";

import { signIn } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-2xl font-semibold">Inicia sesión en AcelerIA</CardTitle>
          <CardDescription>
            Conecta tu cuenta para guardar proyectos, iterar con el copiloto y retomar donde lo dejaste.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            className="w-full"
            onClick={() => signIn("google")}
          >
            Continúa con Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn("github")}
          >
            Continúa con GitHub
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => signIn("credentials", { email: "founder@demo.com" })}
          >
            Accede como invitado
          </Button>
          <Link href="/" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Volver a AcelerIA
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}

