"use client";

import { Lightbulb, LayoutDashboard, Presentation, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/store/project-store";

const ARTIFACT_ITEMS = [
  {
    key: "leanCanvas" as const,
    label: "Lean Canvas",
    description: "Hipótesis clave del modelo de negocio",
    icon: Lightbulb,
  },
  {
    key: "roadmap" as const,
    label: "Roadmap",
    description: "Fases, hitos y métricas prioritarias",
    icon: LayoutDashboard,
  },
  {
    key: "pitch" as const,
    label: "Pitch",
    description: "Elevator pitch y estructura del deck",
    icon: Presentation,
  },
  {
    key: "empathy" as const,
    label: "Discovery",
    description: "Entrevistas y supuestos a validar",
    icon: Users,
  },
];

export function ArtifactNavigator() {
  const selectedArtifact = useProjectStore((state) => state.selectedArtifact);
  const selectArtifact = useProjectStore((state) => state.selectArtifact);
  const dirtyArtifacts = useProjectStore((state) => state.dirtyArtifacts);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Artefactos
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Vector versiona automáticamente cada artefacto. Ajusta hipótesis, roadmap y narrativa sin perder contexto.
        </p>
      </div>
      <nav className="space-y-2">
        {ARTIFACT_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = selectedArtifact === item.key;
          const isDirty = dirtyArtifacts.has(item.key);
          return (
            <Button
              key={item.key}
              type="button"
              variant="ghost"
              className={cn(
                "group flex w-full flex-col items-start gap-1 rounded-xl border border-transparent p-4 text-left transition-all",
                isActive && "border-primary/60 bg-primary/10 text-primary",
                !isActive && "border-transparent bg-transparent",
              )}
              onClick={() => selectArtifact(item.key)}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border",
                      isActive
                        ? "border-primary/50 bg-primary/10"
                        : "border-border bg-muted",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  </span>
                  <div>
                    <p className={cn("text-sm font-semibold", isActive ? "text-primary" : "text-foreground")}>{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                {isDirty && <Badge variant="outline">Sin guardar</Badge>}
              </div>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}

