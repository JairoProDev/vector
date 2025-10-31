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
  if (process.env.VECTOR_FORCE_DEMO === "true") return true;
  if (process.env.VECTOR_USE_MOCK_ORCHESTRATOR === "true") return true;
  if (!env.MONGODB_URI) return true;
  if (!hasConfiguredLLMProvider()) return true;
  return false;
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

  return {
    id,
    playbookId: "mock-startup-playbook",
    projectType,
    idea,
    provider: "google",
    createdAt: now,
    updatedAt: now,
    userId,
    artifacts: {
      leanCanvas: {
        problem: `Dolor central: ${headline}`,
        customerSegments: "Segmento que más sufre el problema",
        existingAlternatives: "Soluciones actuales y sus límites",
        solution: "Propuesta del proyecto",
        uniqueValueProposition: "Promesa diferenciadora",
        unfairAdvantage: "Ventaja difícil de copiar",
        keyMetrics: "Indicadores clave para medir progreso",
        channels: "Canales prioritarios de adquisición",
        costStructure: "Costos principales de la operación",
        revenueStreams: "Cómo se capturará valor",
        earlyAdopters: "Perfil de early adopters",
        highLevelConcept: "Analogía simple que explica la propuesta",
      },
      roadmap: {
        summary: "Roadmap generado en modo demostración.",
        markdown: `## Fase 1 - Descubrimiento\n- Validar hipótesis iniciales\n\n## Fase 2 - MVP\n- Lanzar versión funcional con propuesta central\n\n## Fase 3 - Escala\n- Optimizar métricas y crecer en adquisición`,
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
        elevatorPitch: `Estamos creando una plataforma para ${headline.toLowerCase()} con una experiencia guiada end-to-end.`,
        positioningStatement:
          "Para equipos que necesitan lanzar con claridad, Vector entrega un playbook accionable coordinando agentes especializados automáticamente.",
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
          "Vertical en crecimiento impulsado por automatización",
          "Cadena multi-agente reduce tiempo a ejecución",
          "Equipo con experiencia operativa",
        ],
      },
      empathy: {
        interviewQuestions: [
          "¿Qué intentas resolver actualmente y cómo lo haces?",
          "¿Qué sucede si no solucionas este problema a tiempo?",
          "¿Qué resultado te haría sentir que valió la pena?",
        ],
        assumptionsToValidate: [
          "El problema es prioritario",
          "Los early adopters valoran automatización",
          "Existe disposición a pagar por velocidad y foco",
        ],
        personas: ["Founder early-stage", "Líder de innovación"],
        successSignals: [
          "Compromiso para pilotos",
          "Enfoque en métricas accionables",
          "Referencias a procesos manuales actuales",
        ],
      },
    },
    orchestratorLog: [
      {
        id: "idea",
        label: "Analizando idea",
        status: "success",
        description: "Validación rápida completada (modo demo)",
        startedAt: now,
        finishedAt: now,
      },
      {
        id: "anchor",
        label: "Lean Canvas",
        status: "success",
        description: "Playbook simulado",
        startedAt: now,
        finishedAt: now,
      },
      {
        id: "roadmap",
        label: "Roadmap",
        status: "success",
        description: "Secuencia estratégica generada",
        startedAt: now,
        finishedAt: now,
      },
      {
        id: "pitch",
        label: "Pitch",
        status: "success",
        description: "Narrativa lista",
        startedAt: now,
        finishedAt: now,
      },
      {
        id: "empathy",
        label: "Discovery",
        status: "success",
        description: "Guía de validación creada",
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

