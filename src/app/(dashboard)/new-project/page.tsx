import type { Metadata } from "next";

import { NewProjectForm } from "@/components/project/new-project-form";

export const metadata: Metadata = {
  title: "AcelerIA | Crea tu proyecto",
};

export default function NewProjectPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:px-10">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          AcelerIA · Orquestador de proyectos
        </p>
        <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
          Desbloquea el día cero: de idea nebulosa a plan con momentum en minutos.
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Cuéntanos tu visión y deja que nuestro stack de agentes le dé forma. Mientras otros se quedan en la parálisis, tú sales con un plan listo para ejecutar.
        </p>
      </header>
      <NewProjectForm />
    </main>
  );
}

