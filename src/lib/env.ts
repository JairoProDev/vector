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

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  DEFAULT_LLM_PROVIDER: process.env.DEFAULT_LLM_PROVIDER as
    | "openai"
    | "anthropic"
    | "google"
    | undefined,
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

export const env = parsed.data;

export const isDev = env.NODE_ENV === "development";

