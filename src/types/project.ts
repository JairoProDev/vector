export type ProjectType = "startup" | "book" | "contentChannel";

export type ArtifactKey =
  | "leanCanvas"
  | "roadmap"
  | "pitch"
  | "empathy";

export interface LeanCanvas {
  problem: string;
  customerSegments: string;
  existingAlternatives: string;
  solution: string;
  uniqueValueProposition: string;
  unfairAdvantage: string;
  keyMetrics: string;
  channels: string;
  costStructure: string;
  revenueStreams: string;
  earlyAdopters?: string;
  highLevelConcept?: string;
}

export interface RoadmapPhase {
  name: string;
  focus: string;
  objectives: string[];
  keyInitiatives: string[];
  successMetrics: string[];
  risks?: string[];
}

export interface Roadmap {
  summary: string;
  markdown: string;
  phases: RoadmapPhase[];
}

export interface PitchDeck {
  elevatorPitch: string;
  positioningStatement: string;
  deckOutline: string[];
  investorHighlights: string[];
}

export interface EmpathyInsights {
  interviewQuestions: string[];
  assumptionsToValidate: string[];
  personas?: string[];
  successSignals?: string[];
}

export interface ProjectArtifacts {
  leanCanvas: LeanCanvas;
  roadmap: Roadmap;
  pitch: PitchDeck;
  empathy: EmpathyInsights;
}

export type ArtifactRecord = {
  [K in ArtifactKey]: ProjectArtifacts[K];
};

export interface OrchestratorStepLog {
  id: string;
  label: string;
  description?: string;
  status: "pending" | "running" | "success" | "error";
  provider?: string;
  model?: string;
  startedAt?: string;
  finishedAt?: string;
  error?: string;
}

export interface ProjectPayload {
  id: string;
  playbookId: string;
  projectType: ProjectType;
  idea: string;
  artifacts: ProjectArtifacts;
  orchestratorLog: OrchestratorStepLog[];
  provider: "openai" | "anthropic" | "google";
  createdAt: string;
  updatedAt: string;
  userId?: string | null;
}

export interface GenerateProjectInput {
  idea: string;
  projectType: ProjectType;
  llmProvider?: "openai" | "anthropic" | "google";
  anchorModel?: string;
}

