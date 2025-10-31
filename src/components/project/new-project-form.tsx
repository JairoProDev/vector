"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import {
  Sparkles,
  Rocket,
  Target,
  PenSquare,
  UsersRound,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProjectPayload } from "@/types/project";

type StepStatus = "idle" | "running" | "success" | "error";

interface StepConfig {
  id: "idea" | "anchor" | "roadmap" | "pitch" | "empathy";
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: StepConfig[] = [
  {
    id: "idea",
    label: "Analizando idea",
    description: "Rompiendo la inercia inicial",
    icon: Sparkles,
  },
  {
    id: "anchor",
    label: "Lean Canvas",
    description: "Hipótesis estratégicas claras",
    icon: Target,
  },
  {
    id: "roadmap",
    label: "Roadmap",
    description: "Fases y métricas prioritarias",
    icon: Rocket,
  },
  {
    id: "pitch",
    label: "Pitch",
    description: "Narrativa para convencer",
    icon: PenSquare,
  },
  {
    id: "empathy",
    label: "Discovery",
    description: "Preguntas para validar",
    icon: UsersRound,
  },
];

const projectTypes = [
  {
    value: "startup" as const,
    label: "Startup 0 → 1",
    description: "Ideación, validación y roadmap para founders tempranos.",
    comingSoon: false,
  },
  {
    value: "book" as const,
    label: "Libro / Playbook",
    description: "Da estructura a tu próximo best-seller.",
    comingSoon: true,
  },
  {
    value: "contentChannel" as const,
    label: "Canal de contenidos",
    description: "Plan de crecimiento para newsletters o medios.",
    comingSoon: true,
  },
];

export function NewProjectForm() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [projectType, setProjectType] = useState<typeof projectTypes[number]["value"]>("startup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(() =>
    steps.map(() => "idle" as StepStatus),
  );
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const charactersUsed = idea.trim().length;

  const ideaTooShort = charactersUsed > 0 && charactersUsed < 10;
  const ideaTooLong = charactersUsed > 1800;

  const canSubmit = !loading && charactersUsed >= 10 && charactersUsed <= 1800;

  const startProgressAnimation = () => {
    setStepStatuses([
      "running",
      "pending" as StepStatus,
      "pending" as StepStatus,
      "pending" as StepStatus,
      "pending" as StepStatus,
    ].map((status, index) => (index === 0 ? "running" : "idle")));

    timersRef.current = steps.slice(1).map((step, index) => {
      const timeoutId = window.setTimeout(() => {
        setStepStatuses((prev) =>
          prev.map((status, idx) => {
            if (idx === index + 1) {
              return status === "success" ? status : "running";
            }
            return status;
          }),
        );
      }, (index + 1) * 1200);

      return timeoutId;
    });
  };

  const stopProgressAnimation = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    setStepStatuses(steps.map(() => "idle"));
    startProgressAnimation();

    try {
      const response = await fetch("/api/projects/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea,
          projectType,
        }),
      });

      if (!response.ok) {
        const message = await response.json().catch(() => ({ message: "" }));
        throw new Error(message?.message ?? "No pudimos generar el proyecto.");
      }

      const data = (await response.json()) as { project: ProjectPayload };
      stopProgressAnimation();

      const logMap = new Map(
        data.project.orchestratorLog.map((entry) => [entry.id, entry.status]),
      );

      setStepStatuses((prev) =>
        prev.map((_, index) => {
          const step = steps[index];
          if (step.id === "idea") return "success";
          const downstreamStatus = logMap.get(step.id);
          if (!downstreamStatus) return "success";
          return downstreamStatus === "error" ? "error" : "success";
        }),
      );

      router.push(`/project/${data.project.id}`);
    } catch (err) {
      console.error(err);
      stopProgressAnimation();
      setStepStatuses((prev) =>
        prev.map((status) => (status === "success" ? status : "error")),
      );
      setError(err instanceof Error ? err.message : "Error inesperado generando el proyecto");
      setLoading(false);
    }
  };

  const StepIcon = useMemo(() => {
    return function StepStatusIcon({ status, icon: Icon }: { status: StepStatus; icon: StepConfig["icon"] }) {
      if (status === "success") {
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      }
      if (status === "error") {
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      }
      if (status === "running") {
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      }
      return <Icon className="h-4 w-4 text-muted-foreground" />;
    };
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="shadow-lg">
        <CardHeader className="gap-3">
          <Badge variant="secondary" className="w-fit">MVP Zero-to-One</Badge>
          <CardTitle>Transforma tu idea en una misión accionable</CardTitle>
          <CardDescription>
            AcelerIA orquesta agentes especializados para generar Lean Canvas, roadmap, pitch y plan de validación. Tú escribes la idea, nosotros despejamos el camino del día cero.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="idea" className="text-sm font-medium text-muted-foreground">
                  Describe tu idea
                </label>
                <span className={cn("text-xs", charactersUsed > 1800 ? "text-destructive" : "text-muted-foreground")}
                >
                  {charactersUsed}/1800
                </span>
              </div>
              <Textarea
                id="idea"
                placeholder="Ej: JourNews: un TikTok de noticias verificadas en 60 segundos, pensado para jóvenes profesionales sin tiempo..."
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                spellCheck={false}
                maxLength={2200}
                disabled={loading}
              />
              {ideaTooShort && (
                <p className="text-xs text-destructive">
                  Añade un poco más de contexto: problema, público o qué lo hace distinto.
                </p>
              )}
              {ideaTooLong && (
                <p className="text-xs text-destructive">
                  Manténlo por debajo de 1800 caracteres para que el orquestador sea preciso.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Tipo de proyecto</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {projectTypes.map((item) => {
                  const isActive = projectType === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => !item.comingSoon && setProjectType(item.value)}
                      disabled={item.comingSoon || loading}
                      className={cn(
                        "flex h-full flex-col justify-between rounded-xl border p-3 text-left transition-all",
                        "hover:border-primary/60 hover:shadow-md",
                        item.comingSoon && "cursor-not-allowed opacity-60",
                        isActive && "border-primary bg-primary/5",
                      )}
                    >
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold leading-tight">{item.label}</p>
                        <p className="text-xs text-muted-foreground leading-snug">{item.description}</p>
                      </div>
                      {item.comingSoon ? (
                        <Badge variant="outline" className="mt-3 w-fit">Próximamente</Badge>
                      ) : (
                        <Badge variant={isActive ? "default" : "outline"} className="mt-3 w-fit">
                          {isActive ? "Seleccionado" : "Disponible"}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                Al generar aceptas que guardemos el proyecto para continuar iterando.
              </div>
              <Button type="submit" className="w-full sm:w-auto" disabled={!canSubmit}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Orquestando AcelerIA...
                  </>
                ) : (
                  <>Generar proyecto</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="h-max border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Cadena de agentes</CardTitle>
          <CardDescription>
            AcelerIA ejecuta esta secuencia para aterrizar tu visión en menos de 90 segundos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {steps.map((step, index) => {
              const status = stepStatuses[index];
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border border-transparent bg-card/60 p-3",
                    status === "running" && "border-primary/30 bg-primary/10",
                    status === "success" && "border-emerald-200 bg-emerald-50",
                    status === "error" && "border-destructive/40 bg-destructive/10",
                  )}
                >
                  <div className="mt-1">
                    <StepIcon status={status} icon={Icon} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold leading-tight">{step.label}</p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="rounded-md border border-border/60 bg-background/80 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">¿Qué obtendrás?</p>
            <ul className="mt-2 space-y-1.5">
              <li>• Lean Canvas editable listo para validar con clientes.</li>
              <li>• Roadmap de tres fases con objetivos y métricas.</li>
              <li>• Elevator pitch y estructura de deck en 10 slides.</li>
              <li>• Guía de entrevistas para salir a la calle mañana.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

