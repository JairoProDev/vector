import { ProjectWorkspaceClient } from "@/components/project/project-workspace-client";

interface ProjectPageProps {
  params: { id: string };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  // HACKATHON MODE: Use client-side component to read from localStorage
  return <ProjectWorkspaceClient projectId={params.id} />;
}


