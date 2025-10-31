import { randomUUID } from "crypto";

import { env } from "@/lib/env";
import type { ProjectPayload } from "@/types/project";

declare global {
  // eslint-disable-next-line no-var
  var __vectorMockProjects: Map<string, ProjectPayload> | undefined;
}

const mockStore = globalThis.__vectorMockProjects ?? new Map<string, ProjectPayload>();

if (process.env.NODE_ENV !== "production") {
  globalThis.__vectorMockProjects = mockStore;
}

export function hasConfiguredLLMProvider() {
  return Boolean(env.OPENAI_API_KEY || env.ANTHROPIC_API_KEY || env.GOOGLE_GENERATIVE_AI_API_KEY);
}

export function shouldUseMockOrchestrator() {
  // HACKATHON MODE: ALWAYS USE MOCK - Never fail, just simulate everything
  return true;
}

export function createMockProject({
  idea,
  projectType,
  userId,
}: {
  idea: string;
  projectType: ProjectPayload["projectType"];
  userId: string | null;
}): ProjectPayload {
  const now = new Date().toISOString();
  const id = randomUUID();
  const normalizedIdea = idea.trim();
  const headline = normalizedIdea.length > 0 ? normalizedIdea : "Describe la visión de la misión";
  const lowerHeadline = headline.toLowerCase();
  const shortTagline = headline.length > 72 ? `${headline.slice(0, 69)}…` : headline;
  const highLevelConcept = `Vector · ${shortTagline}`;

  const problemStatement = `Equipos que quieren ${lowerHeadline} se pierden en la traducción entre visión y ejecución.`;
  const solutionStatement = `Vector arma en minutos el plan maestro para ${lowerHeadline}, alineando estrategia, roadmap, pitch y experimentos en un solo workspace.`;
  const uvpStatement = `A diferencia de documentos estáticos, Vector orquesta agentes que actualizan ${lowerHeadline} en tiempo real y empujan la siguiente acción validable.`;
  const metricsStatement = `Tiempo hasta acción < 10 min · Experimentos lanzados/semana · Momentum del proyecto basado en evidencia.`;
  const channelsStatement = `Comunidades fundadoras · Alianzas con aceleradoras · Contenido "behind the build" mostrando cómo Vector ejecuta ${lowerHeadline}.`;
  const unfair = `Plantillas vivas conectadas a integraciones y un coach anti-parálisis con contexto completo de ${lowerHeadline}.`;
  const earlyAdopters = `Founders pre-incubación obsesionados con ${lowerHeadline}, labs de innovación y consultores estratégicos.`;
  const revenueStatement = `Suscripción Vector Pro · Playbooks premium enfocados en ${lowerHeadline} · Consultoría para cohorts que necesitan velocidad.`;
  const costStatement = `Infraestructura LLM, orquestación de agentes dedicados a ${lowerHeadline} y soporte estratégico.`;

  return {
    id,
    playbookId: "vector-demo-playbook",
    projectType,
    idea,
    provider: "vector-demo",
    createdAt: now,
    updatedAt: now,
    userId,
    artifacts: {
      leanCanvas: {
        problem: problemStatement,
        customerSegments: `Founders y equipos que lanzan ${lowerHeadline} sin una guía clara en day cero.`,
        existingAlternatives:
          "Docs dispersos, plantillas en Notion y sesiones eternas sin decisiones claras.",
        solution: solutionStatement,
        uniqueValueProposition: uvpStatement,
        unfairAdvantage: unfair,
        keyMetrics: metricsStatement,
        channels: channelsStatement,
        costStructure: costStatement,
        revenueStreams: revenueStatement,
        earlyAdopters: earlyAdopters,
        highLevelConcept,
      },
      roadmap: {
        summary: `Vector divide ${headline} en tres misiones: descubrir verdad de usuarios, lanzar MVP significativo y escalar aprendizaje continuo.`,
        markdown: `## Fase 1 · Fundamento Estratégico\n- Entrevistar 10 líderes sobre ${lowerHeadline}\n- Mapear jobs-to-be-done y riesgos principales\n- Definir métricas de validación inicial\n\n## Fase 2 · MVP Orquestado\n- Diseñar experiencia mínima que entregue el core de ${lowerHeadline}\n- Activar playbooks de GTM con 3 canales priorizados\n- Integrar feedback loops semanales con Vector\n\n## Fase 3 · Escala y Momentum\n- Automatizar experimentos recurrentes\n- Integrar equipos externos (ventas/marketing) con el workspace Vector\n- Preparar narrativa de fundraising enfocada en ${headline}`,
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
        elevatorPitch: `Estamos creando ${headline} en 60 segundos: Vector toma la idea, la traduce en estrategia y te empuja a validar en el mundo real antes de escribir una línea de código.`,
        positioningStatement:
          `Para equipos que quieren ${lowerHeadline} sin parálisis, Vector es el copiloto que orquesta agentes estratégicos y entrega misiones accionables. A diferencia de gestores tradicionales, se enfoca en la primera validación real.`,
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
          `Mercado preparado: founders buscando claridad para ${lowerHeadline}.`,
          "Cadena multi-agente reduce tiempo hasta la acción a minutos.",
          "Playbooks y partnerships con aceleradoras crean moats de distribución.",
        ],
      },
      empathy: {
        interviewQuestions: [
          `¿Cuándo intentaste lanzar ${lowerHeadline} por última vez y qué te bloqueó?`,
          "¿Cómo mides si una experimentación temprana valió la pena?",
          "¿Qué tendría que pasar para confiar en un copiloto que te empuja fuera del plan?",
        ],
        assumptionsToValidate: [
          `Los equipos priorizan resolver ${lowerHeadline} durante las primeras semanas.`,
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
        description: `Vector interpretó las intenciones detrás de “${shortTagline}”.`,
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

export function storeMockProject(project: ProjectPayload) {
  mockStore.set(project.id, project);
}

export function getMockProject(id: string) {
  return mockStore.get(id);
}

