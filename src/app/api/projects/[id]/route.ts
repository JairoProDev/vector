import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ProjectModel } from "@/lib/models/project";
import { getMockProject, shouldUseMockOrchestrator, updateMockProject } from "@/lib/orchestrator/mock";
import { toProjectPayload } from "@/lib/serializers/project";
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
    const session = await getAuthSession();

    // Check if ID is a UUID (mock project)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (shouldUseMockOrchestrator() || isUUID) {
      const mockProject = getMockProject(id);
      if (!mockProject) {
        return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
      }
      if (!canAccessProject(session?.user?.id, mockProject.userId ?? null)) {
        return NextResponse.json(
          { message: "No tienes permisos para ver este proyecto" },
          { status: 403 },
        );
      }
      return NextResponse.json({ project: mockProject });
    }

    await connectToDatabase();
    const project = await ProjectModel.findById(id);

    if (!project) {
      return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
    }

    if (!canAccessProject(session?.user?.id, project.userId)) {
      return NextResponse.json(
        { message: "No tienes permisos para ver este proyecto" },
        { status: 403 },
      );
    }

    return NextResponse.json({ project: toProjectPayload(project) });
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
    const session = await getAuthSession();

    // Check if ID is a UUID (mock project)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (shouldUseMockOrchestrator() || isUUID) {
      const mockProject = getMockProject(id);
      if (!mockProject) {
        return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
      }

      if (!canAccessProject(session?.user?.id, mockProject.userId ?? null)) {
        return NextResponse.json(
          { message: "No tienes permisos para modificar este proyecto" },
          { status: 403 },
        );
      }

      // Update mock project
      const updates: Partial<ProjectPayload> = {};
      if (body.artifacts) {
        updates.artifacts = {
          leanCanvas: { ...mockProject.artifacts.leanCanvas, ...(body.artifacts.leanCanvas ?? {}) },
          roadmap: {
            summary: body.artifacts.roadmap?.summary ?? mockProject.artifacts.roadmap.summary,
            markdown: body.artifacts.roadmap?.markdown ?? mockProject.artifacts.roadmap.markdown,
            phases: body.artifacts.roadmap?.phases ?? mockProject.artifacts.roadmap.phases,
          },
          pitch: { ...mockProject.artifacts.pitch, ...(body.artifacts.pitch ?? {}) },
          empathy: { ...mockProject.artifacts.empathy, ...(body.artifacts.empathy ?? {}) },
        };
      }

      const updatedProject = updateMockProject(id, updates);
      return NextResponse.json({ project: updatedProject });
    }

    await connectToDatabase();
    const project = await ProjectModel.findById(id);

    if (!project) {
      return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
    }

    if (!canAccessProject(session?.user?.id, project.userId)) {
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
        project.set("artifacts.leanCanvas", {
          ...project.artifacts.leanCanvas,
          ...leanCanvas,
        });
      }
      if (roadmap) {
        if (roadmap.summary !== undefined) {
          project.set("artifacts.roadmap.summary", roadmap.summary);
        }
        if (roadmap.markdown !== undefined) {
          project.set("artifacts.roadmap.markdown", roadmap.markdown);
        }
        if (roadmap.phases && roadmap.phases.length) {
          project.set("artifacts.roadmap.phases", roadmap.phases);
        }
      }
      if (pitch) {
        project.set("artifacts.pitch", {
          ...project.artifacts.pitch,
          ...pitch,
        });
      }
      if (empathy) {
        project.set("artifacts.empathy", {
          ...project.artifacts.empathy,
          ...empathy,
        });
      }
    }

    await project.save();

    return NextResponse.json({ project: toProjectPayload(project) });
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

