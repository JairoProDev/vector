import type {
  ArtifactKey,
  ProjectArtifacts,
  ProjectType,
} from "@/types/project";

import type { LLMProvider } from "@/lib/llm/providers";

export interface AgentRunContext {
  idea: string;
  projectType: ProjectType;
  artifacts: Partial<ProjectArtifacts>;
}

export interface AgentRunOptions {
  context: AgentRunContext;
  provider?: LLMProvider;
  model?: string;
}

export interface AgentResult<TArtifact> {
  key: ArtifactKey;
  label: string;
  data: TArtifact;
  raw: string;
  provider: LLMProvider;
  model: string;
}

export interface AgentDefinition<TArtifact = unknown> {
  id: string;
  label: string;
  description: string;
  artifactKey: ArtifactKey;
  run(options: AgentRunOptions): Promise<AgentResult<TArtifact>>;
  dependsOn?: ArtifactKey[];
  provider?: LLMProvider;
  model?: string;
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  projectTypes: ProjectType[];
  agents: AgentDefinition[];
  defaultProvider?: LLMProvider;
  defaultModel?: string;
}

export interface OrchestratorInput {
  idea: string;
  projectType: ProjectType;
  provider?: LLMProvider;
  anchorModel?: string;
}

export interface OrchestratorAgentLog {
  id: string;
  label: string;
  status: "pending" | "running" | "success" | "error";
  description?: string;
  provider?: string;
  model?: string;
  startedAt?: string;
  finishedAt?: string;
  error?: string;
}

export interface OrchestratorResponse {
  artifacts: ProjectArtifacts;
  log: OrchestratorAgentLog[];
  playbookId: string;
  provider: LLMProvider;
}

