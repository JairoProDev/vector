import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  MONGODB_URI: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().optional(),
  DEFAULT_LLM_PROVIDER: z
    .enum(["openai", "anthropic", "google"])
    .optional(),
  DEFAULT_OPENAI_MODEL: z.string().optional(),
  DEFAULT_ANTHROPIC_MODEL: z.string().optional(),
  DEFAULT_GOOGLE_MODEL: z.string().optional(),
});

const resolvedGoogleKey =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ??
  process.env.GOOGLE_GEMINI_API_KEY ??
  process.env.GEMINI_API_KEY ??
  process.env.GEMINI_APIKEY ??
  undefined;

const resolvedDefaultProvider = (process.env.DEFAULT_LLM_PROVIDER as
  | "openai"
  | "anthropic"
  | "google"
  | undefined) ?? (resolvedGoogleKey ? "google" : undefined);

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  GOOGLE_GENERATIVE_AI_API_KEY: resolvedGoogleKey,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  DEFAULT_LLM_PROVIDER: resolvedDefaultProvider,
  DEFAULT_OPENAI_MODEL: process.env.DEFAULT_OPENAI_MODEL,
  DEFAULT_ANTHROPIC_MODEL: process.env.DEFAULT_ANTHROPIC_MODEL,
  DEFAULT_GOOGLE_MODEL: process.env.DEFAULT_GOOGLE_MODEL,
});

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment configuration");
}

const data = parsed.data;

if (!data.DEFAULT_LLM_PROVIDER) {
  if (data.GOOGLE_GENERATIVE_AI_API_KEY) {
    data.DEFAULT_LLM_PROVIDER = "google";
  } else if (data.OPENAI_API_KEY) {
    data.DEFAULT_LLM_PROVIDER = "openai";
  } else if (data.ANTHROPIC_API_KEY) {
    data.DEFAULT_LLM_PROVIDER = "anthropic";
  }
}

export const env = data;

export const isDev = env.NODE_ENV === "development";

