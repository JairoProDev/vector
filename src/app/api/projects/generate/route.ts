import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ProjectModel } from "@/lib/models/project";
import { runOrchestrator } from "@/lib/orchestrator";
import { toProjectPayload } from "@/lib/serializers/project";
import { generateProjectSchema } from "@/lib/validators/project";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = generateProjectSchema.parse(json);

    const session = await getAuthSession();

    await connectToDatabase();

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

    return NextResponse.json(
      {
        project: toProjectPayload(project),
      },
      { status: 201 },
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

