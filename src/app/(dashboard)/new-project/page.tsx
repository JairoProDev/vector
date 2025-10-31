import type { Metadata } from "next";

import { NewProjectForm } from "@/components/project/new-project-form";

export const metadata: Metadata = {
  title: "VECTOR | Lanzar nueva misión",
};

export default function NewProjectPage() {
  return (
    <main className="relative mx-auto w-full max-w-7xl px-6 py-14 sm:px-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.15),transparent_55%)]" />
      <div className="flex flex-col gap-12">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-primary">
            Vector · Mission Control
          </div>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
            Diseña la misión, programa a los agentes y lanza tu proyecto con momentum.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Vector sincroniza agentes especializados para convertir tus hipótesis en un sistema operativo de ejecución. Escribe la visión, el resto es timing perfecto, foco y claridad accionable.
          </p>
        </header>

        <NewProjectForm />
      </div>
    </main>
  );
}

