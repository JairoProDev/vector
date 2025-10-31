"use client";

import { useMemo, useState } from "react";

import { Loader2, Wand2, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { ArtifactNavigator } from "@/components/project/artifact-navigator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/store/project-store";
import type {
  ArtifactKey,
  LeanCanvas,
  Roadmap,
  RoadmapPhase,
  PitchDeck,
  EmpathyInsights,
} from "@/types/project";

const artifactMeta: Record<ArtifactKey, { title: string; subtitle: string }> = {
  leanCanvas: {
    title: "Lean Canvas",
    subtitle: "Pulsa cada bloque para refinar hipótesis y métricas.",
  },
  roadmap: {
    title: "Roadmap",
    subtitle: "Estructura fases, iniciativas y métricas de éxito.",
  },
  pitch: {
    title: "Pitch",
    subtitle: "Afina narrativa, diferenciadores y deck outline.",
  },
  empathy: {
    title: "Discovery",
    subtitle: "Diseña entrevistas e hipótesis a validar.",
  },
};

export function ArtifactCanvas() {
  const project = useProjectStore((state) => state.project);
  const selectedArtifact = useProjectStore((state) => state.selectedArtifact);
  const dirtyArtifacts = useProjectStore((state) => state.dirtyArtifacts);
  const savingState = useProjectStore((state) => state.savingState);
  const setSavingState = useProjectStore((state) => state.setSavingState);
  const updateArtifact = useProjectStore((state) => state.updateArtifact);
  const hydrateProject = useProjectStore((state) => state.hydrateProject);
  const markArtifactsSynced = useProjectStore((state) => state.markArtifactsSynced);
  const lastError = useProjectStore((state) => state.lastError);

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  if (!project) {
    return null;
  }

  const isDirty = dirtyArtifacts.has(selectedArtifact);

  const handleSave = async () => {
    if (!isDirty) return;

    setSavingState("saving");
    setSaveMessage(null);

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artifacts: {
            [selectedArtifact]: project.artifacts[selectedArtifact],
          },
          selectedArtifact,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: "" }));
        throw new Error(payload?.message ?? "No se pudo guardar");
      }

      const data = await response.json();
      hydrateProject(data.project);
      markArtifactsSynced([selectedArtifact]);
      setSavingState("saved");
      setSaveMessage("Cambios guardados");
      setTimeout(() => {
        setSavingState("idle");
        setSaveMessage(null);
      }, 1800);
    } catch (error) {
      console.error(error);
      setSavingState(
        "error",
        error instanceof Error ? error.message : "Error al guardar cambios",
      );
      setTimeout(() => {
        setSavingState("idle");
      }, 2500);
    }
  };

  const { title, subtitle } = artifactMeta[selectedArtifact];

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
      <div className="hidden lg:block">
        <ArtifactNavigator />
      </div>

      <div className="space-y-6">
        <Card className="border-primary/20 bg-card/80 backdrop-blur">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{subtitle}</CardDescription>
              <div className="flex flex-wrap items-center gap-2">
                {isDirty ? (
                  <Badge variant="outline" className="border-amber-400 text-amber-600">
                    Pendiente de guardar
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-emerald-300 text-emerald-600">
                    Sin cambios pendientes
                  </Badge>
                )}
                {savingState === "saved" && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> Guardado en la nube
                  </span>
                )}
                {savingState === "error" && lastError && (
                  <span className="text-xs text-destructive">{lastError}</span>
                )}
                {saveMessage && <span className="text-xs text-muted-foreground">{saveMessage}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => (
                  window.open("https://www.notion.so", "_blank")
                )}
                disabled
              >
                <Wand2 className="mr-2 h-4 w-4" /> Iteración asistida
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!isDirty || savingState === "saving"}
              >
                {savingState === "saving" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>

        <ScrollArea className="h-[calc(100vh-280px)] overflow-y-auto pr-2">
          <div className="space-y-6 pb-10">
            {selectedArtifact === "leanCanvas" && (
              <LeanCanvasEditor
                value={project.artifacts.leanCanvas}
                onChange={(next) => updateArtifact("leanCanvas", next)}
              />
            )}
            {selectedArtifact === "roadmap" && (
              <RoadmapEditor
                value={project.artifacts.roadmap}
                onChange={(next) => updateArtifact("roadmap", next)}
              />
            )}
            {selectedArtifact === "pitch" && (
              <PitchEditor
                value={project.artifacts.pitch}
                onChange={(next) => updateArtifact("pitch", next)}
              />
            )}
            {selectedArtifact === "empathy" && (
              <EmpathyEditor
                value={project.artifacts.empathy}
                onChange={(next) => updateArtifact("empathy", next)}
              />
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function LeanCanvasEditor({
  value,
  onChange,
}: {
  value: LeanCanvas;
  onChange: (next: LeanCanvas) => void;
}) {
  const fields: Array<{ key: keyof LeanCanvas; label: string; placeholder: string }>[] = [
    [
      {
        key: "problem",
        label: "Problema",
        placeholder: "¿Qué dolores críticos resuelves?",
      },
      {
        key: "solution",
        label: "Solución",
        placeholder: "Producto o experiencia propuesta",
      },
      {
        key: "uniqueValueProposition",
        label: "Propuesta de valor",
        placeholder: "¿Por qué serás la mejor opción?",
      },
    ],
    [
      {
        key: "customerSegments",
        label: "Segmentos",
        placeholder: "¿Quiénes sufren más el problema?",
      },
      {
        key: "existingAlternatives",
        label: "Alternativas actuales",
        placeholder: "¿Qué hacen hoy para resolverlo?",
      },
      {
        key: "unfairAdvantage",
        label: "Ventaja injusta",
        placeholder: "Activos únicos difíciles de copiar",
      },
    ],
    [
      {
        key: "keyMetrics",
        label: "Métricas clave",
        placeholder: "Señales objetivas que validan progreso",
      },
      {
        key: "channels",
        label: "Canales",
        placeholder: "Cómo llegarás a tus early adopters",
      },
    ],
    [
      {
        key: "costStructure",
        label: "Estructura de costes",
        placeholder: "Principales inversiones necesarias",
      },
      {
        key: "revenueStreams",
        label: "Ingresos",
        placeholder: "Fuentes de monetización y pricing inicial",
      },
    ],
  ];

  return (
    <div className="space-y-6">
      {fields.map((row, rowIndex) => (
        <div key={rowIndex} className="grid gap-4 md:grid-cols-2">
          {row.map((field) => (
            <Card key={field.key} className="border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{field.label}</CardTitle>
                <CardDescription>{field.placeholder}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={value[field.key] ?? ""}
                  onChange={(event) =>
                    onChange({
                      ...value,
                      [field.key]: event.target.value,
                    })
                  }
                  rows={4}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-dashed border-muted-foreground/20">
          <CardHeader>
            <CardTitle className="text-base">Early adopters</CardTitle>
            <CardDescription>
              Describe el perfil específico de los primeros usuarios ideales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={value.earlyAdopters ?? ""}
              onChange={(event) =>
                onChange({
                  ...value,
                  earlyAdopters: event.target.value,
                })
              }
              rows={3}
            />
          </CardContent>
        </Card>
        <Card className="border-dashed border-muted-foreground/20">
          <CardHeader>
            <CardTitle className="text-base">High level concept</CardTitle>
            <CardDescription>
              Llévalo a una frase memorable fácil de repetir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={value.highLevelConcept ?? ""}
              onChange={(event) =>
                onChange({
                  ...value,
                  highLevelConcept: event.target.value,
                })
              }
              rows={3}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RoadmapEditor({
  value,
  onChange,
}: {
  value: Roadmap;
  onChange: (next: Roadmap) => void;
}) {
  const handlePhaseChange = (index: number, updater: (phase: RoadmapPhase) => RoadmapPhase) => {
    const phases = value.phases.map((phase, idx) => (idx === index ? updater(phase) : phase));
    onChange({ ...value, phases });
  };

  const listToTextarea = (items: string[]) => items.join("\n");
  const textareaToList = (text: string) =>
    text
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen ejecutivo</CardTitle>
          <CardDescription>
            Contextualiza el roadmap: visión, enfoque y qué resuelve cada fase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={4}
            value={value.summary}
            onChange={(event) => onChange({ ...value, summary: event.target.value })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Markdown maestro</CardTitle>
          <CardDescription>
            Edita la versión Markdown para compartir con stakeholders. Vista previa debajo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={10}
            value={value.markdown}
            onChange={(event) => onChange({ ...value, markdown: event.target.value })}
          />
          <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40 p-4 prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value.markdown}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {value.phases.map((phase, index) => (
          <Card key={phase.name ?? index} className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-base">{phase.name}</CardTitle>
              <CardDescription>{phase.focus}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Enfoque</label>
                <Textarea
                  rows={3}
                  value={phase.focus}
                  onChange={(event) =>
                    handlePhaseChange(index, (current) => ({
                      ...current,
                      focus: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Objetivos</label>
                <Textarea
                  rows={3}
                  value={listToTextarea(phase.objectives)}
                  placeholder="Una línea por objetivo"
                  onChange={(event) =>
                    handlePhaseChange(index, (current) => ({
                      ...current,
                      objectives: textareaToList(event.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Iniciativas clave</label>
                <Textarea
                  rows={3}
                  value={listToTextarea(phase.keyInitiatives)}
                  onChange={(event) =>
                    handlePhaseChange(index, (current) => ({
                      ...current,
                      keyInitiatives: textareaToList(event.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Métricas de éxito</label>
                <Textarea
                  rows={3}
                  value={listToTextarea(phase.successMetrics)}
                  onChange={(event) =>
                    handlePhaseChange(index, (current) => ({
                      ...current,
                      successMetrics: textareaToList(event.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-muted-foreground">Riesgos / supuestos</label>
                <Textarea
                  rows={2}
                  value={listToTextarea(phase.risks ?? [])}
                  placeholder="Una línea por riesgo"
                  onChange={(event) =>
                    handlePhaseChange(index, (current) => ({
                      ...current,
                      risks: textareaToList(event.target.value),
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PitchEditor({
  value,
  onChange,
}: {
  value: PitchDeck;
  onChange: (next: PitchDeck) => void;
}) {
  const toList = (items: string[]) => items.join("\n");
  const fromList = (text: string) =>
    text
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Elevator pitch</CardTitle>
          <CardDescription>
            3-4 frases que expliquen problema, solución, segmentación y diferenciador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={5}
            value={value.elevatorPitch}
            onChange={(event) => onChange({ ...value, elevatorPitch: event.target.value })}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Positioning statement</CardTitle>
          <CardDescription>
            Fórmula estilo “Para X que... nuestro producto...” para facilitar memorización.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={4}
            value={value.positioningStatement}
            onChange={(event) =>
              onChange({ ...value, positioningStatement: event.target.value })
            }
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Investor highlights</CardTitle>
          <CardDescription>
            Bullets con tracción, mercado, equipo u otros activos relevantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={6}
            value={toList(value.investorHighlights)}
            placeholder="Una línea por highlight"
            onChange={(event) =>
              onChange({
                ...value,
                investorHighlights: fromList(event.target.value),
              })
            }
          />
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Deck outline</CardTitle>
          <CardDescription>
            Define la narrativa slide por slide para tu próxima reunión.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={8}
            value={toList(value.deckOutline)}
            onChange={(event) =>
              onChange({ ...value, deckOutline: fromList(event.target.value) })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

function EmpathyEditor({
  value,
  onChange,
}: {
  value: EmpathyInsights;
  onChange: (next: EmpathyInsights) => void;
}) {
  const toList = (items: string[]) => items.join("\n");
  const fromList = (text: string) =>
    text
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  const update = (partial: Partial<EmpathyInsights>) => onChange({ ...value, ...partial });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preguntas de entrevista</CardTitle>
          <CardDescription>
            Mantén preguntas abiertas enfocadas en comportamiento real.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={8}
            value={toList(value.interviewQuestions)}
            onChange={(event) => update({ interviewQuestions: fromList(event.target.value) })}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supuestos a validar</CardTitle>
          <CardDescription>
            Hipótesis críticas que necesitas confirmar rápido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={8}
            value={toList(value.assumptionsToValidate)}
            onChange={(event) =>
              update({ assumptionsToValidate: fromList(event.target.value) })
            }
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personas objetivo</CardTitle>
          <CardDescription>
            Describe el arquetipo de usuario al que entrevistarás.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={6}
            value={toList(value.personas ?? [])}
            onChange={(event) => update({ personas: fromList(event.target.value) })}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Señales de éxito</CardTitle>
          <CardDescription>
            ¿Qué evidencias confirmarían que vas por buen camino?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={6}
            value={toList(value.successSignals ?? [])}
            onChange={(event) => update({ successSignals: fromList(event.target.value) })}
          />
        </CardContent>
      </Card>
    </div>
  );
}

