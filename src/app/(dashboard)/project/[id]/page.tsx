import { notFound } from "next/navigation";

import { ProjectWorkspace } from "@/components/project/project-workspace";
import { getAuthSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ProjectModel } from "@/lib/models/project";
import { getMockProject, shouldUseMockOrchestrator } from "@/lib/orchestrator/mock";
import { toProjectPayload } from "@/lib/serializers/project";

interface ProjectPageProps {
  params: { id: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // HACKATHON MODE: Always use mock, never connect to real DB
  const session = await getAuthSession().catch(() => null);

  const mockProject = getMockProject(params.id);
  if (!mockProject) {
    notFound();
  }
  if (!canAccessProject(session?.user?.id, mockProject.userId ?? null)) {
    notFound();
  }
  return <ProjectWorkspace project={mockProject} />;
}

function canAccessProject(userId?: string, projectUserId?: string | null) {
  if (!projectUserId) return true;
  if (!userId) return false;
  return userId === projectUserId;
}


