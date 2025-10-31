import type { ProjectDocument } from "@/lib/models/project";
import type { ProjectPayload } from "@/types/project";

export function toProjectPayload(doc: ProjectDocument): ProjectPayload {
  return {
    id: doc._id.toString(),
    idea: doc.idea,
    projectType: doc.projectType,
    playbookId: doc.playbookId,
    artifacts: doc.artifacts,
    orchestratorLog: doc.orchestratorLog.map((entry) => ({
      ...entry,
      startedAt: entry.startedAt?.toISOString(),
      finishedAt: entry.finishedAt?.toISOString(),
    })),
    provider: doc.provider as ProjectPayload["provider"],
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    userId: doc.userId,
  } as ProjectPayload;
}

