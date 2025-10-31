import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { getMockProject, storeMockProject, createMockProject } from "@/lib/orchestrator/mock";
import { updateProjectSchema } from "@/lib/validators/project";
import type { ProjectPayload } from "@/types/project";

const paramsSchema = z.object({
  id: z.string().min(1),
});

export async function GET(
  _request: Request,
  context: { params: { id: string } },
) {
  try {
    const { id } = paramsSchema.parse(context.params);
    const session = await getAuthSession().catch(() => null);

    // HACKATHON MODE: Always return a project, never 404
    let project = getMockProject(id);

    if (!project) {
      // If not in memory (serverless restart), create a generic fallback
      // In production, the real data should come from localStorage on client side
      console.warn(`[HACKATHON] Project ${id} not in memory, creating fallback mock`);
      project = createFallbackMockProject(id, session?.user?.id ?? null);
    }

    if (!canAccessProject(session?.user?.id, project.userId ?? null)) {
      return NextResponse.json(
        { message: "No tienes permisos para ver este proyecto" },
        { status: 403 },
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Parámetros inválidos", details: error.flatten() },
        { status: 400 },
      );
    }

    console.error("/api/projects/[id] GET error", error);
    return NextResponse.json(
      { message: "No se pudo recuperar el proyecto" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } },
) {
  try {
    const { id } = paramsSchema.parse(context.params);
    const body = updateProjectSchema.parse(await request.json());
    const session = await getAuthSession().catch(() => null);

    // HACKATHON MODE: Always work with a project, create fallback if needed
    let project = getMockProject(id);

    if (!project) {
      // In serverless, memory is lost - create a fallback to allow updates
      console.warn(`[HACKATHON] Project ${id} not in memory for PUT, creating fallback`);
      project = createFallbackMockProject(id, session?.user?.id ?? null);
    }

    if (!canAccessProject(session?.user?.id, project.userId ?? null)) {
      return NextResponse.json(
        { message: "No tienes permisos para modificar este proyecto" },
        { status: 403 },
      );
    }

    if (body.artifacts) {
      if (!project.artifacts) {
        return NextResponse.json(
          { message: "El proyecto aún no tiene artefactos almacenados" },
          { status: 400 },
        );
      }
      const { leanCanvas, roadmap, pitch, empathy } = body.artifacts;
      if (leanCanvas) {
        project.artifacts.leanCanvas = {
          ...project.artifacts.leanCanvas,
          ...leanCanvas,
        };
      }
      if (roadmap) {
        if (roadmap.summary !== undefined) {
          project.artifacts.roadmap.summary = roadmap.summary;
        }
        if (roadmap.markdown !== undefined) {
          project.artifacts.roadmap.markdown = roadmap.markdown;
        }
        if (roadmap.phases && roadmap.phases.length) {
          project.artifacts.roadmap.phases = roadmap.phases;
        }
      }
      if (pitch) {
        project.artifacts.pitch = {
          ...project.artifacts.pitch,
          ...pitch,
        };
      }
      if (empathy) {
        project.artifacts.empathy = {
          ...project.artifacts.empathy,
          ...empathy,
        };
      }
    }

    // Update the updatedAt timestamp
    project.updatedAt = new Date().toISOString();

    // Store back in mock
    storeMockProject(project);

    return NextResponse.json({ project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Datos inválidos", details: error.flatten() },
        { status: 400 },
      );
    }

    console.error("/api/projects/[id] PUT error", error);
    return NextResponse.json(
      { message: "No se pudo actualizar el proyecto" },
      { status: 500 },
    );
  }
}

function canAccessProject(
  userId: string | undefined,
  projectUserId: string | null,
) {
  if (!projectUserId) return true;
  if (!userId) return false;
  return projectUserId === userId;
}

// HACKATHON MODE: Create a generic fallback project when not found in memory
function createFallbackMockProject(id: string, userId: string | null): ProjectPayload {
  const now = new Date().toISOString();

  return {
    id,
    playbookId: "vector-demo-playbook",
    projectType: "startup",
    idea: "Tu proyecto de innovación",
    provider: "vector-demo",
    createdAt: now,
    updatedAt: now,
    userId,
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

