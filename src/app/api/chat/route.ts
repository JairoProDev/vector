import { streamText } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ProjectModel } from "@/lib/models/project";
import { getMockProject, shouldUseMockOrchestrator } from "@/lib/orchestrator/mock";
import { resolveModelName, resolveProvider } from "@/lib/llm/providers";
import type { ArtifactKey, ProjectArtifacts } from "@/types/project";

const chatSchema = z.object({
  projectId: z.string().min(1),
  artifactKey: z.enum(["leanCanvas", "roadmap", "pitch", "empathy"]),
  messages: z.array(
    z.object({
      id: z.string().optional(),
      role: z.enum(["system", "user", "assistant"]),
      content: z.string(),
    }),
  ),
  provider: z.enum(["openai", "anthropic", "google"]).optional(),
  model: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = chatSchema.parse(await request.json());
    const session = await getAuthSession();

    // Check if ID is a UUID (mock project)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.projectId);

    let projectData: { idea: string; provider: string; artifacts: ProjectArtifacts; userId: string | null };

    if (shouldUseMockOrchestrator() || isUUID) {
      const mockProject = getMockProject(body.projectId);
      if (!mockProject) {
        return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
      }

      if (!canAccessProject(session?.user?.id, mockProject.userId ?? null)) {
        return NextResponse.json(
          { message: "No puedes conversar sobre este proyecto" },
          { status: 403 },
        );
      }

      projectData = {
        idea: mockProject.idea,
        provider: mockProject.provider,
        artifacts: mockProject.artifacts,
        userId: mockProject.userId ?? null,
      };
    } else {
      await connectToDatabase();
      const project = await ProjectModel.findById(body.projectId);

      if (!project) {
        return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
      }

      if (!canAccessProject(session?.user?.id, project.userId)) {
        return NextResponse.json(
          { message: "No puedes conversar sobre este proyecto" },
          { status: 403 },
        );
      }

      if (!project.artifacts) {
        return NextResponse.json(
          { message: "El proyecto todavía no tiene artefactos generados" },
          { status: 400 },
        );
      }

      projectData = {
        idea: project.idea,
        provider: project.provider ?? "openai",
        artifacts: project.artifacts as ProjectArtifacts,
        userId: project.userId,
      };
    }

    const systemPrompt = buildSystemPrompt(body.artifactKey, projectData.idea, projectData.artifacts);

    const providerFallback = projectData.provider as "openai" | "anthropic" | "google";
    const { provider, getModel } = resolveProvider(body.provider ?? providerFallback);
    const modelName = resolveModelName(provider, body.model);

    const result = await streamText({
      model: getModel(modelName),
      system: systemPrompt,
      messages: body.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      maxOutputTokens: 600,
      temperature: 0.4,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Solicitud inválida", details: error.flatten() },
        { status: 400 },
      );
    }

    console.error("/api/chat error", error);
    return NextResponse.json(
      { message: "No se pudo generar la respuesta del copiloto" },
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

function buildSystemPrompt(
  artifact: ArtifactKey,
  idea: string,
  artifacts: ProjectArtifacts,
) {
  const base = `Actúa como copiloto estratégico. La idea base es: ${idea}`;

  switch (artifact) {
    case "leanCanvas":
      return `${base} Estás colaborando en el Lean Canvas. Ofrece retroalimentación crítica, detecta hipótesis riesgosas y sugiere mejoras concretas. Responde con pasos accionables.`;
    case "roadmap":
      return `${base} El usuario revisa su roadmap: ${artifacts.roadmap.markdown}. Como Product Manager senior, detalla dependencias, riesgos y métricas. Sugiere cómo desglosar iniciativas en entregables.`;
    case "pitch":
      return `${base} El usuario refina su pitch: Elevator pitch actual: ${artifacts.pitch.elevatorPitch}. Estructura argumentos convincentes, anticipa preguntas de inversionistas y alinea narrativa con el Lean Canvas.`;
    case "empathy":
      return `${base} Están trabajando en entrevistas y validaciones: ${JSON.stringify(artifacts.empathy)}. Como especialista en investigación de usuarios, profundiza preguntas, propone experimentos y cómo interpretar resultados.`;
    default:
      return base;
  }
}

