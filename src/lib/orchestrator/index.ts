import { projectArtifactsSchema } from "@/lib/validators/project";
import { startupPlaybook } from "@/lib/orchestrator/playbooks/startup";
import type {
  OrchestratorInput,
  OrchestratorResponse,
  AgentRunContext,
  OrchestratorAgentLog,
  Playbook,
} from "@/lib/orchestrator/types";
import type { ArtifactKey, ProjectArtifacts } from "@/types/project";

const playbooks: Playbook[] = [startupPlaybook];

export function listPlaybooks() {
  return playbooks;
}

export function getPlaybook(projectType: OrchestratorInput["projectType"]) {
  const playbook = playbooks.find((entry) =>
    entry.projectTypes.includes(projectType),
  );

  if (!playbook) {
    throw new Error(`No playbook available for project type: ${projectType}`);
  }

  return playbook;
}

export async function runOrchestrator(
  input: OrchestratorInput,
): Promise<OrchestratorResponse> {
  const playbook = getPlaybook(input.projectType);
  const agentLogs: OrchestratorAgentLog[] = playbook.agents.map((agent) => ({
    id: agent.id,
    label: agent.label,
    description: agent.description,
    status: "pending",
  }));

  const context: AgentRunContext = {
    idea: input.idea,
    projectType: input.projectType,
    artifacts: {},
  };

  let activeProvider = input.provider ?? playbook.defaultProvider ?? "openai";

  for (const agent of playbook.agents) {
    const logEntry = agentLogs.find((log) => log.id === agent.id)!;
    logEntry.status = "running";
    logEntry.startedAt = new Date().toISOString();

    console.info(
      "[Vector] ▶️ Ejecutando agente",
      JSON.stringify({ id: agent.id, label: agent.label, provider: activeProvider }),
    );

    try {
      validateDependencies(agent.dependsOn, context.artifacts);

      const result = await agent.run({
        context,
        provider: agent.provider ?? input.provider ?? playbook.defaultProvider,
        model: agent.model ??
          (agent.id === "anchor"
            ? input.anchorModel ?? playbook.defaultModel
            : undefined),
      });

      (context.artifacts as Record<ArtifactKey, ProjectArtifacts[ArtifactKey]>)[
        result.key
      ] = result.data as ProjectArtifacts[typeof result.key];
      activeProvider = result.provider;

      logEntry.status = "success";
      logEntry.provider = result.provider;
      logEntry.model = result.model;
      logEntry.finishedAt = new Date().toISOString();

      console.info(
        "[Vector] ✅ Agente completado",
        JSON.stringify({ id: agent.id, provider: result.provider, model: result.model }),
      );
    } catch (error) {
      logEntry.status = "error";
      logEntry.error =
        error instanceof Error
          ? error.message
          : "Unexpected orchestrator error";
      logEntry.finishedAt = new Date().toISOString();
      console.error(
        "[Vector] ❌ Agente con error",
        JSON.stringify({ id: agent.id, message: logEntry.error }),
      );
      throw error;
    }
  }

  const hydratedArtifacts = projectArtifactsSchema.parse({
    leanCanvas: context.artifacts.leanCanvas,
    roadmap: context.artifacts.roadmap,
    pitch: context.artifacts.pitch,
    empathy: context.artifacts.empathy,
  });

  return {
    artifacts: hydratedArtifacts,
    log: agentLogs,
    playbookId: playbook.id,
    provider: activeProvider,
  };
}

function validateDependencies(
  dependencies: ArtifactKey[] | undefined,
  artifacts: AgentRunContext["artifacts"],
) {
  if (!dependencies?.length) return;

  for (const key of dependencies) {
    if (!artifacts[key]) {
      throw new Error(
        `Missing required artifact "${key}" for downstream agent execution`,
      );
    }
  }
}

