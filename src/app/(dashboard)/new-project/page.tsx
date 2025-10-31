import type { Metadata } from "next";

import { NewProjectForm } from "@/components/project/new-project-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "VECTOR | Lanzar nueva misión",
};

export default function NewProjectPage() {
  return (
    <main className="flex h-screen w-full flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border/60 bg-card/80 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" /> Vector
          </div>
          <div className="h-5 w-px bg-border/40" />
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Mission Console · Nueva misión
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-border/60 bg-background/80 text-xs font-medium uppercase tracking-[0.2em]">
            Workspace Activo
          </Badge>
          <Badge variant="outline" className="border-amber-400/40 bg-amber-400/10 text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-400">
            Estado: Configuración
          </Badge>
        </div>
      </header>

      <section className="flex flex-1 overflow-hidden px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
        <div className="flex h-full w-full overflow-hidden rounded-2xl border border-border/50 bg-card/70 shadow-[0_24px_90px_-60px_rgba(0,0,0,0.75)]">
          <NewProjectForm />
        </div>
      </section>
    </main>
  );
}

