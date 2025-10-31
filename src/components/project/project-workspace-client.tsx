"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

import { ProjectWorkspace } from "@/components/project/project-workspace";
import type { ProjectPayload } from "@/types/project";

interface ProjectWorkspaceClientProps {
  projectId: string;
}

export function ProjectWorkspaceClient({ projectId }: ProjectWorkspaceClientProps) {
  const [project, setProject] = useState<ProjectPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // HACKATHON MODE: Try to load from localStorage first (for serverless environments)
    const loadProject = () => {
      try {
        const stored = localStorage.getItem(`vector_project_${projectId}`);
        if (stored) {
          const parsed = JSON.parse(stored) as ProjectPayload;
          setProject(parsed);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Failed to load from localStorage", err);
      }

      // If not in localStorage, try to fetch from API
      fetch(`/api/projects/${projectId}`)
        .then((res) => {
          if (!res.ok) {
            // If API fails, generate a generic mock project
            console.warn("Failed to fetch project, using fallback mock");
            setProject(createFallbackProject(projectId));
            setLoading(false);
            return;
          }
          return res.json();
        })
        .then((data) => {
          if (data?.project) {
            setProject(data.project);
          } else {
            setProject(createFallbackProject(projectId));
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading project", err);
          // Use fallback mock on any error
          setProject(createFallbackProject(projectId));
          setLoading(false);
        });
    };

    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return <ProjectWorkspace project={project} />;
}

// Fallback mock project for when nothing else works
function createFallbackProject(id: string): ProjectPayload {
  const now = new Date().toISOString();

  return {
    id,
    playbookId: "vector-demo-playbook",
    projectType: "startup",
    idea: "Tu proyecto de innovación",
    provider: "vector-demo",
    createdAt: now,
    updatedAt: now,
    userId: null,
    artifacts: {
      leanCanvas: {
        problem: "Equipos que quieren innovar se pierden en la traducción entre visión y ejecución.",
        customerSegments: "Founders y equipos que lanzan proyectos sin una guía clara.",
        existingAlternatives: "Docs dispersos, plantillas en Notion y sesiones eternas sin decisiones claras.",
        solution: "Vector arma en minutos el plan maestro, alineando estrategia, roadmap, pitch y experimentos en un solo workspace.",
        uniqueValueProposition: "A diferencia de documentos estáticos, Vector orquesta agentes que actualizan en tiempo real.",
        unfairAdvantage: "Plantillas vivas conectadas a integraciones y un coach anti-parálisis con contexto completo.",
        keyMetrics: "Tiempo hasta acción < 10 min · Experimentos lanzados/semana · Momentum basado en evidencia.",
        channels: "Comunidades fundadoras · Alianzas con aceleradoras · Contenido 'behind the build'.",
        costStructure: "Infraestructura LLM, orquestación de agentes y soporte estratégico.",
        revenueStreams: "Suscripción Vector Pro · Playbooks premium · Consultoría para cohorts.",
        earlyAdopters: "Founders pre-incubación, labs de innovación y consultores estratégicos.",
        highLevelConcept: "Vector · Tu proyecto de innovación",
      },
      roadmap: {
        summary: "Vector divide tu proyecto en tres misiones: descubrir verdad de usuarios, lanzar MVP significativo y escalar aprendizaje continuo.",
        markdown: `## Fase 1 · Fundamento Estratégico\n- Entrevistar 10 líderes sobre el problema\n- Mapear jobs-to-be-done y riesgos principales\n- Definir métricas de validación inicial\n\n## Fase 2 · MVP Orquestado\n- Diseñar experiencia mínima que entregue el core\n- Activar playbooks de GTM con 3 canales priorizados\n- Integrar feedback loops semanales con Vector\n\n## Fase 3 · Escala y Momentum\n- Automatizar experimentos recurrentes\n- Integrar equipos externos con el workspace Vector\n- Preparar narrativa de fundraising`,
        phases: [
          {
            name: "Fase 1 - Descubrimiento",
            focus: "Entender profundidad del problema",
            objectives: ["Completar entrevistas", "Medir severidad"],
            keyInitiatives: ["Mapa de hipótesis", "Diarios de usuario"],
            successMetrics: ["10 entrevistas", "2 insights accionables"],
            risks: ["Segmento incorrecto", "Sesgo en respuestas"],
          },
          {
            name: "Fase 2 - MVP",
            focus: "Probar propuesta de valor",
            objectives: ["Lanzar MVP", "Obtener usuarios activos"],
            keyInitiatives: ["Desarrollo MVP", "Onboarding asistido"],
            successMetrics: ["15 usuarios activos", "Retención >30%"],
            risks: ["Experiencia incompleta", "Desalineación de expectativas"],
          },
          {
            name: "Fase 3 - Escala",
            focus: "Optimizar y crecer",
            objectives: ["Refinar oferta", "Escalar adquisición"],
            keyInitiatives: ["Iteración continua", "Experimentación en canales"],
            successMetrics: ["MRR inicial", "CAC sostenible"],
            risks: ["Crecimiento prematuro", "Costos elevados"],
          },
        ],
      },
      pitch: {
        elevatorPitch: "Vector toma la idea, la traduce en estrategia y te empuja a validar en el mundo real antes de escribir una línea de código.",
        positioningStatement: "Para equipos que quieren innovar sin parálisis, Vector es el copiloto que orquesta agentes estratégicos y entrega misiones accionables.",
        deckOutline: [
          "Problema",
          "Oportunidad",
          "Solución",
          "Producto",
          "Modelo de negocio",
          "Tracción",
          "Go-to-market",
          "Equipo",
          "Roadmap",
          "Cierre",
        ],
        investorHighlights: [
          "Mercado preparado: founders buscando claridad.",
          "Cadena multi-agente reduce tiempo hasta la acción a minutos.",
          "Playbooks y partnerships con aceleradoras crean moats de distribución.",
        ],
      },
      empathy: {
        interviewQuestions: [
          "¿Cuándo intentaste lanzar tu proyecto por última vez y qué te bloqueó?",
          "¿Cómo mides si una experimentación temprana valió la pena?",
          "¿Qué tendría que pasar para confiar en un copiloto que te empuja fuera del plan?",
        ],
        assumptionsToValidate: [
          "Los equipos priorizan resolver problemas durante las primeras semanas.",
          "La claridad estratégica es la fricción principal sobre la ejecución técnica.",
          "Disposición a pagar por acompañamiento continuo y playbooks accionables.",
        ],
        personas: ["Founder early-stage", "Líder de innovación", "Consultor estratégico"],
        successSignals: [
          "Compromiso para pilotos con entrevistas programadas",
          "Uso recurrente del workspace como fuente única de verdad",
          "Recomendaciones orgánicas del playbook a otros equipos",
        ],
      },
    },
    orchestratorLog: [
      {
        id: "idea",
        label: "Analizando idea",
        status: "success",
        description: "Vector interpretó las intenciones del proyecto.",
        startedAt: now,
        finishedAt: now,
      },
      {
        id: "anchor",
        label: "Lean Canvas",
        status: "success",
        description: "Hipótesis estratégicas mapeadas y priorizadas.",
        startedAt: now,
        finishedAt: now,
      },
      {
        id: "roadmap",
        label: "Roadmap",
        status: "success",
        description: "Fases y métricas listas para ejecución.",
        startedAt: now,
        finishedAt: now,
      },
      {
        id: "pitch",
        label: "Pitch",
        status: "success",
        description: "Historia lista para inversionistas y aliados.",
        startedAt: now,
        finishedAt: now,
      },
      {
        id: "empathy",
        label: "Discovery",
        status: "success",
        description: "Experimentos de validación listos para salir a la calle.",
        startedAt: now,
        finishedAt: now,
      },
    ],
  };
}
