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
  ShieldHalf,
  Layers,
  SlidersHorizontal,
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
  const [infoPanel, setInfoPanel] = useState<"telemetry" | "manual">("telemetry");

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const progressStepMs = isDemoMode ? 280 : 1200;

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
    setStepStatuses(steps.map((_, index) => (index === 0 ? "running" : "idle")));

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
      }, (index + 1) * progressStepMs);

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

      const redirectDelay = isDemoMode ? progressStepMs : 350;
      window.setTimeout(() => {
        router.push(`/project/${data.project.id}`);
      }, redirectDelay);
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
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
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

  const activeProjectType = projectTypes.find((item) => item.value === projectType)!;

  return (
    <div className="grid h-full w-full gap-4 overflow-hidden p-4 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)_minmax(260px,320px)] lg:gap-6">
      <div className="order-2 flex flex-col gap-4 overflow-hidden lg:order-none">
        <Card className="flex flex-col border border-border/60 bg-background/80 shadow-none">
          <CardHeader className="flex flex-col gap-3 pb-3">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              <span className="inline-flex items-center gap-2 text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" /> Vector
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-primary">
                Mission Ready
              </span>
            </div>
            <CardTitle className="text-base font-semibold text-foreground">
              Resumen de la misión
            </CardTitle>
            <CardDescription className="text-xs">
              Controla parámetros clave antes de lanzar la orquestación.
            </CardDescription>
            {isDemoMode && (
              <Badge variant="outline" className="w-fit border-amber-400/70 bg-amber-500/10 text-[10px] font-semibold uppercase tracking-[0.34em] text-amber-400">
                Demo instantánea
              </Badge>
            )}
          </CardHeader>
          <CardContent className="grid gap-3 text-xs text-muted-foreground">
            <div className="rounded-lg border border-border/40 bg-card/80 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Misión activa
              </p>
              <div className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <Layers className="h-3.5 w-3.5 text-primary" />
                {activeProjectType.label}
              </div>
            </div>
            <div className="rounded-lg border border-border/40 bg-card/80 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Contexto capturado
              </p>
              <p
                className={cn(
                  "mt-1 text-sm font-semibold",
                  charactersUsed > 1800 ? "text-destructive" : "text-foreground",
                )}
              >
                {charactersUsed}/1800 caracteres
              </p>
            </div>
            <div className="rounded-lg border border-border/40 bg-card/80 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Artefactos previstos
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Lean Canvas · Roadmap · Pitch · Discovery
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col border border-border/60 bg-background/80 shadow-none">
          <CardHeader className="flex flex-col gap-3 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Panel operativo</CardTitle>
              <div className="inline-flex items-center gap-1 rounded-full bg-card/70 p-1 text-xs">
                {([
                  { id: "telemetry", label: "Telemetría" },
                  { id: "manual", label: "Manual" },
                ] as const).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setInfoPanel(option.id)}
                    className={cn(
                      "rounded-full px-3 py-1 font-medium transition-colors",
                      infoPanel === option.id
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <CardDescription className="text-xs">
              Cambia entre métricas en vivo o el manual de referencia sin abandonar el flujo.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4 flex-1 overflow-y-auto pr-1 text-xs text-muted-foreground">
            {infoPanel === "telemetry" ? (
              <div className="space-y-3">
                <div className="rounded-lg border border-border/50 bg-card/80 px-3 py-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.26em]">
                    <span>Cadena</span>
                    <span className="text-primary">5 agentes</span>
                  </div>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    Vector distribuirá tokens y proveedores automáticamente según la misión.
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-card/80 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em]">Checklist</p>
                  <ul className="mt-2 space-y-1.5">
                    <li>• Idea ≥ 10 caracteres y ≤ 1800.</li>
                    <li>• Selecciona misión antes de lanzar.</li>
                    <li>• Revisa telemetría durante la ejecución.</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-border/50 bg-card/80 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em]">Consejo</p>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    Usa lenguaje directo sobre problema, segmento y resultados esperados para mejorar la orquestación.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                  <ShieldHalf className="h-4 w-4" />
                  Manual de lanzamiento
                </div>
                <div className="rounded-lg border border-border/40 bg-card/80 px-3 py-2 leading-relaxed">
                  • Describe problema, usuario y resultados deseados.
                </div>
                <div className="rounded-lg border border-border/40 bg-card/80 px-3 py-2 leading-relaxed">
                  • Selecciona la misión inicial (nuevos tipos pronto).
                </div>
                <div className="rounded-lg border border-border/40 bg-card/80 px-3 py-2 leading-relaxed">
                  • Vector compone agentes en cadena y versiona cada artefacto.
                </div>
                <div className="rounded-lg border border-border/40 bg-card/80 px-3 py-2 leading-relaxed">
                  • Todo queda guardado en tu workspace para iteraciones futuras.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="order-1 flex h-full min-h-0 flex-col border border-border/70 bg-card/80 shadow-none lg:order-none">
        <CardHeader className="flex flex-col gap-3 border-b border-border/60 pb-5">
          <Badge variant="secondary" className="w-fit">MVP Zero-to-One</Badge>
          <CardTitle className="text-xl font-semibold text-foreground">
            Describe la misión que Vector debe ejecutar
          </CardTitle>
          <CardDescription>
            Vector alinea agentes especializados para generar un playbook accionable. Tu claridad define la calidad de los artefactos: Lean Canvas, Roadmap, Pitch y Discovery.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <form className="flex h-full flex-col" onSubmit={handleSubmit}>
            <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6 pr-2 sm:pr-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="idea" className="text-sm font-medium text-muted-foreground">
                    Describe tu idea
                  </label>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      charactersUsed > 1800 ? "text-destructive" : "text-muted-foreground",
                    )}
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
                  className="min-h-[200px] resize-none"
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
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Tipo de proyecto</p>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                    {projectTypes.length} misiones
                  </span>
                </div>
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
                          "group flex h-full flex-col justify-between rounded-2xl border border-border/60 bg-card/70 p-4 text-left transition-all",
                          "hover:border-primary/60 hover:bg-primary/10 hover:shadow-lg",
                          item.comingSoon && "cursor-not-allowed opacity-60",
                          isActive && "border-primary/80 bg-primary/10 shadow-lg",
                        )}
                      >
                        <div className="space-y-2">
                          <p className="text-sm font-semibold leading-tight text-foreground">{item.label}</p>
                          <p className="text-xs leading-snug text-muted-foreground">{item.description}</p>
                        </div>
                        {item.comingSoon ? (
                          <Badge variant="outline" className="mt-4 w-fit border-dashed">
                            Próximamente
                          </Badge>
                        ) : (
                          <Badge
                            variant={isActive ? "default" : "outline"}
                            className={cn(
                              "mt-4 w-fit",
                              isActive && "bg-primary text-primary-foreground",
                            )}
                          >
                            {isActive ? "Activa" : "Disponible"}
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
            </div>

            <div className="border-t border-border/60 px-6 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  Al lanzar aceptas que Vector almacene esta iteración en tu workspace para futuras mejoras.
                </div>
                <Button type="submit" className="w-full sm:w-auto" disabled={!canSubmit}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Orquestando Vector...
                    </>
                  ) : (
                    <>Lanzar misión</>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="order-3 flex h-full min-h-0 flex-col border border-border/60 bg-card/70 shadow-none lg:order-none">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
          <div>
            <CardTitle className="text-base">Cadena de agentes</CardTitle>
            <CardDescription>Secuencia ejecutada por el orquestador.</CardDescription>
          </div>
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex-1 space-y-4 overflow-y-auto pr-1">
          <div className="space-y-3 pt-4">
            {steps.map((step, index) => {
              const status = stepStatuses[index];
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border border-border/60 bg-card/80 p-3",
                    status === "running" && "border-primary/40 bg-primary/10",
                    status === "success" && "border-primary/30 bg-primary/10",
                    status === "error" && "border-destructive/40 bg-destructive/10",
                  )}
                >
                  <div className="mt-1">
                    <StepIcon status={status} icon={Icon} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold leading-tight text-foreground">{step.label}</p>
                    <p className="text-xs leading-snug text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="rounded-md border border-border/60 bg-card/80 p-4 text-xs text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">¿Qué obtendrás?</p>
            <ul className="space-y-1.5">
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

