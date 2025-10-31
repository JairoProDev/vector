import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const LeanCanvasSchema = new Schema(
  {
    problem: { type: String, default: "" },
    customerSegments: { type: String, default: "" },
    existingAlternatives: { type: String, default: "" },
    solution: { type: String, default: "" },
    uniqueValueProposition: { type: String, default: "" },
    unfairAdvantage: { type: String, default: "" },
    keyMetrics: { type: String, default: "" },
    channels: { type: String, default: "" },
    costStructure: { type: String, default: "" },
    revenueStreams: { type: String, default: "" },
    earlyAdopters: { type: String, default: "" },
    highLevelConcept: { type: String, default: "" },
  },
  { _id: false },
);

const RoadmapPhaseSchema = new Schema(
  {
    name: { type: String, required: true },
    focus: { type: String, default: "" },
    objectives: { type: [String], default: [] },
    keyInitiatives: { type: [String], default: [] },
    successMetrics: { type: [String], default: [] },
    risks: { type: [String], default: [] },
  },
  { _id: false },
);

const RoadmapSchema = new Schema(
  {
    summary: { type: String, default: "" },
    markdown: { type: String, default: "" },
    phases: { type: [RoadmapPhaseSchema], default: [] },
  },
  { _id: false },
);

const PitchSchema = new Schema(
  {
    elevatorPitch: { type: String, default: "" },
    positioningStatement: { type: String, default: "" },
    deckOutline: { type: [String], default: [] },
    investorHighlights: { type: [String], default: [] },
  },
  { _id: false },
);

const EmpathySchema = new Schema(
  {
    interviewQuestions: { type: [String], default: [] },
    assumptionsToValidate: { type: [String], default: [] },
    personas: { type: [String], default: [] },
    successSignals: { type: [String], default: [] },
  },
  { _id: false },
);

const OrchestratorLogSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "running", "success", "error"],
      default: "pending",
    },
    provider: { type: String },
    model: { type: String },
    startedAt: { type: Date },
    finishedAt: { type: Date },
    error: { type: String },
  },
  { _id: false },
);

const ProjectSchema = new Schema(
  {
    idea: { type: String, required: true },
    projectType: {
      type: String,
      enum: ["startup", "book", "contentChannel"],
      required: true,
    },
    playbookId: { type: String, required: true },
    provider: { type: String, required: true },
    userId: { type: String, default: null },
    artifacts: {
      leanCanvas: { type: LeanCanvasSchema, required: true },
      roadmap: { type: RoadmapSchema, required: true },
      pitch: { type: PitchSchema, required: true },
      empathy: { type: EmpathySchema, required: true },
    },
    orchestratorLog: { type: [OrchestratorLogSchema], default: [] },
  },
  { timestamps: true },
);

export type ProjectDocument = InferSchemaType<typeof ProjectSchema> & {
  _id: mongoose.Types.ObjectId;
};

export type ProjectModelType = Model<ProjectDocument>;

export const ProjectModel =
  (mongoose.models.Project as ProjectModelType | undefined) ??
  mongoose.model<ProjectDocument, ProjectModelType>("Project", ProjectSchema);


