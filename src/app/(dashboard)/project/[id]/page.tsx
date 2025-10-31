import dynamic from "next/dynamic";

// HACKATHON MODE: Disable SSR completely to use localStorage
const ProjectWorkspaceClient = dynamic(
  () => import("@/components/project/project-workspace-client").then((mod) => mod.ProjectWorkspaceClient),
  { ssr: false }
);

interface ProjectPageProps {
  params: { id: string };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return <ProjectWorkspaceClient projectId={params.id} />;
}


