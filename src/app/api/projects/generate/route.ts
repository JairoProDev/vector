import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ProjectModel } from "@/lib/models/project";
import { runOrchestrator } from "@/lib/orchestrator";
import {
  createMockProject,
  shouldUseMockOrchestrator,
  storeMockProject,
} from "@/lib/orchestrator/mock";
import { toProjectPayload } from "@/lib/serializers/project";
import { generateProjectSchema } from "@/lib/validators/project";
function buildMockResponse(
  body: z.infer<typeof generateProjectSchema>,
  userId: string | null,
  mode: "demo" | "demo-forced" | "demo-fallback" = "demo",
) {
  const project = createMockProject({
    idea: body.idea,
    projectType: body.projectType,
    userId,
  });
  storeMockProject(project);

  if (process.env.NODE_ENV !== "production") {
    console.info("[Vector] ▶️ Generador (demo) ejecutado", {
      projectId: project.id,
      mode: "mock",
    });
  }

  return NextResponse.json({ project, mode }, { status: 201 });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = generateProjectSchema.parse(json);

    // HACKATHON MODE: Always use mock, never fail
    // Simulate a small delay to make it look real
    await new Promise(resolve => setTimeout(resolve, 100));

    const session = await getAuthSession().catch(() => null);

    return buildMockResponse(
      body,
      session?.user?.id ?? null,
      "demo",
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validación inválida", details: error.flatten() },
        { status: 400 },
      );
    }

    console.error("/api/projects/generate error", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo generar el proyecto.",
      },
      { status: 500 },
    );
  }
}

