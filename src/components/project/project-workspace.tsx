"use client";

import { useEffect } from "react";

import { CheckCircle2, AlertTriangle, Timer, Layers } from "lucide-react";

import { ArtifactCanvas } from "@/components/project/artifact-canvas";
import { ArtifactNavigator } from "@/components/project/artifact-navigator";
import { CopilotPanel } from "@/components/project/copilot-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/store/project-store";
import type { ProjectPayload } from "@/types/project";

const projectTypeLabels: Record<ProjectPayload["projectType"], string> = {
  startup: "Startup 0 → 1",
  book: "Libro / Playbook",
  contentChannel: "Canal de contenidos",
};

export function ProjectWorkspace({ project }: { project: ProjectPayload }) {
  const setProject = useProjectStore((state) => state.setProject);
  const selectedArtifact = useProjectStore((state) => state.selectedArtifact);

  useEffect(() => {
    setProject(project);
  }, [project, setProject]);

  const createdAt = new Date(project.createdAt);
  const updatedAt = new Date(project.updatedAt);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <Card className="border-primary/20 bg-card/90 shadow-lg">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">{projectTypeLabels[project.projectType]}</Badge>
                <Badge variant="outline">Playbook: {project.playbookId}</Badge>
              </div>
              <CardTitle className="text-2xl font-semibold leading-tight">
                {project.idea}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Creado el {formatDate(createdAt)} · Última revisión {formatRelative(updatedAt)}
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-primary" /> Orquestador: {project.provider.toUpperCase()}
              </p>
              <p className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" /> {project.orchestratorLog.length} agentes ejecutados
              </p>
            </div>
          </CardHeader>
        </Card>

        <div className="lg:hidden">
          <ArtifactNavigator />
        </div>

        <ArtifactCanvas />
      </div>

      <div className="space-y-6">
        <OrchestratorTimeline log={project.orchestratorLog} active={selectedArtifact} />
        <CopilotPanel />
      </div>
    </div>
  );
}

function OrchestratorTimeline({
  log,
  active,
}: {
  log: ProjectPayload["orchestratorLog"];
  active: string;
}) {
  return (
    <Card className="border-border/80 bg-background/80">
      <CardHeader>
        <CardTitle className="text-base">Runbook de generación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {log.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "rounded-lg border px-3 py-2",
              entry.status === "success" && "border-emerald-200 bg-emerald-50",
              entry.status === "error" && "border-destructive/60 bg-destructive/10",
              entry.id === active && "border-primary/40 bg-primary/10",
            )}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{entry.label}</p>
              {entry.status === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              {entry.status === "error" && <AlertTriangle className="h-4 w-4 text-destructive" />}
            </div>
            {entry.error ? (
              <p className="text-xs text-destructive">{entry.error}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {entry.description ?? "Completado"}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRelative(date: Date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  return `hace ${days} días`;
}

