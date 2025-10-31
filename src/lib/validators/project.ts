import { z } from "zod";

export const generateProjectSchema = z.object({
  idea: z
    .string()
    .min(10, "Describe la idea con al menos 10 caracteres.")
    .max(2000, "Mantén la idea inicial por debajo de 2000 caracteres."),
  projectType: z.enum(["startup", "book", "contentChannel"]),
  llmProvider: z.enum(["openai", "anthropic", "google"]).optional(),
  anchorModel: z.string().optional(),
});

export const leanCanvasSchema = z.object({
  problem: z.string().default(""),
  customerSegments: z.string().default(""),
  existingAlternatives: z.string().default(""),
  solution: z.string().default(""),
  uniqueValueProposition: z.string().default(""),
  unfairAdvantage: z.string().default(""),
  keyMetrics: z.string().default(""),
  channels: z.string().default(""),
  costStructure: z.string().default(""),
  revenueStreams: z.string().default(""),
  earlyAdopters: z.string().optional().default(""),
  highLevelConcept: z.string().optional().default(""),
});

export const roadmapPhaseSchema = z.object({
  name: z.string(),
  focus: z.string().default(""),
  objectives: z.array(z.string()).default([]),
  keyInitiatives: z.array(z.string()).default([]),
  successMetrics: z.array(z.string()).default([]),
  risks: z.array(z.string()).optional().default([]),
});

export const roadmapSchema = z.object({
  summary: z.string().default(""),
  markdown: z.string().default(""),
  phases: z.array(roadmapPhaseSchema).default([]),
});

export const pitchSchema = z.object({
  elevatorPitch: z.string().default(""),
  positioningStatement: z.string().default(""),
  deckOutline: z.array(z.string()).default([]),
  investorHighlights: z.array(z.string()).default([]),
});

export const empathySchema = z.object({
  interviewQuestions: z.array(z.string()).default([]),
  assumptionsToValidate: z.array(z.string()).default([]),
  personas: z.array(z.string()).optional().default([]),
  successSignals: z.array(z.string()).optional().default([]),
});

export const projectArtifactsSchema = z.object({
  leanCanvas: leanCanvasSchema,
  roadmap: roadmapSchema,
  pitch: pitchSchema,
  empathy: empathySchema,
});

export const updateProjectSchema = z.object({
  artifacts: projectArtifactsSchema.partial(),
  selectedArtifact: z
    .enum(["leanCanvas", "roadmap", "pitch", "empathy"])
    .optional(),
});

export type GenerateProjectInput = z.infer<typeof generateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

