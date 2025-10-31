import { z } from "zod";

const stringArray = () =>
  z.preprocess((value) => {
    if (value === undefined || value === null) {
      return [];
    }

    if (!Array.isArray(value)) {
      return value;
    }

    return value.map((item) => {
      if (typeof item === "string") return item;
      if (typeof item === "number" || typeof item === "boolean") {
        return String(item);
      }
      if (Array.isArray(item)) {
        return item
          .map((subItem) =>
            typeof subItem === "string" ? subItem : JSON.stringify(subItem),
          )
          .join(" · ");
      }
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        if (typeof record.name === "string") {
          return record.name;
        }
        const flat = Object.values(record)
          .filter((val) => val !== undefined && val !== null)
          .map((val) =>
            typeof val === "string" || typeof val === "number"
              ? String(val)
              : JSON.stringify(val),
          )
          .join(" - ");
        return flat || JSON.stringify(record);
      }
      return "";
    });
  }, z.array(z.string()));

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
  objectives: stringArray(),
  keyInitiatives: stringArray(),
  successMetrics: stringArray(),
  risks: stringArray(),
});

export const roadmapSchema = z.object({
  summary: z.string().default(""),
  markdown: z.string().default(""),
  phases: z.array(roadmapPhaseSchema).default([]),
});

export const pitchSchema = z.object({
  elevatorPitch: z.string().default(""),
  positioningStatement: z.string().default(""),
  deckOutline: stringArray(),
  investorHighlights: stringArray(),
});

export const empathySchema = z.object({
  interviewQuestions: stringArray(),
  assumptionsToValidate: stringArray(),
  personas: stringArray(),
  successSignals: stringArray(),
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

