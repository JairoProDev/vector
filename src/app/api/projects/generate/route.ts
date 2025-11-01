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

    const session = await getAuthSession();
    const useMock = shouldUseMockOrchestrator();

    if (useMock) {
      console.info("[Vector] Using mock orchestrator (demo mode)");
      return buildMockResponse(
        body,
        session?.user?.id ?? null,
        "demo",
      );
    }

    // Real orchestration with LLMs and database
    try {
      await connectToDatabase();

      console.info("[Vector] Starting real orchestration", {
        idea: body.idea.substring(0, 50),
        projectType: body.projectType,
        provider: body.llmProvider,
      });

      const orchestratorResult = await runOrchestrator({
        idea: body.idea,
        projectType: body.projectType,
        provider: body.llmProvider,
        anchorModel: body.anchorModel,
      });

      const project = await ProjectModel.create({
        idea: body.idea,
        projectType: body.projectType,
        playbookId: orchestratorResult.playbookId,
        provider: orchestratorResult.provider,
        userId: session?.user?.id ?? null,
        artifacts: orchestratorResult.artifacts,
        orchestratorLog: orchestratorResult.log,
      });

      console.info("[Vector] ✅ Project created successfully", {
        projectId: project._id,
        provider: orchestratorResult.provider,
      });

      return NextResponse.json(
        {
          project: toProjectPayload(project),
          mode: "production",
        },
        { status: 201 },
      );
    } catch (error) {
      console.error("[Vector] ❌ Orchestrator failed, falling back to demo", error);
      // Fallback to demo mode on error
      return buildMockResponse(body, session?.user?.id ?? null, "demo-fallback");
    }
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

