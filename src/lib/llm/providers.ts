import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { type LanguageModel } from "ai";

import { env } from "@/lib/env";

export type LLMProvider = "openai" | "anthropic" | "google";

type ModelFactory = (model: string) => LanguageModel;

const openAIClient = env.OPENAI_API_KEY
  ? createOpenAI({ apiKey: env.OPENAI_API_KEY })
  : null;
const anthropicClient = env.ANTHROPIC_API_KEY
  ? createAnthropic({ apiKey: env.ANTHROPIC_API_KEY })
  : null;
const googleClient = env.GOOGLE_GENERATIVE_AI_API_KEY
  ? createGoogleGenerativeAI({ apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY })
  : null;

export function resolveProvider(
  provider?: LLMProvider,
): { provider: LLMProvider; getModel: ModelFactory } {
  const desired = provider ?? env.DEFAULT_LLM_PROVIDER ?? "openai";

  switch (desired) {
    case "openai": {
      if (!openAIClient) {
        throw new Error(
          "OpenAI provider selected but OPENAI_API_KEY is not configured.",
        );
      }
      return { provider: "openai", getModel: openAIClient as ModelFactory };
    }
    case "anthropic": {
      if (!anthropicClient) {
        throw new Error(
          "Anthropic provider selected but ANTHROPIC_API_KEY is not configured.",
        );
      }
      return { provider: "anthropic", getModel: anthropicClient as ModelFactory };
    }
    case "google": {
      if (!googleClient) {
        throw new Error(
          "Google Vertex provider selected but GOOGLE_GENERATIVE_AI_API_KEY is not configured.",
        );
      }
      return { provider: "google", getModel: googleClient as ModelFactory };
    }
    default: {
      throw new Error(`Unsupported provider: ${desired}`);
    }
  }
}

export function resolveModelName(provider: LLMProvider, override?: string) {
  if (override) return override;

  switch (provider) {
    case "openai":
      return env.DEFAULT_OPENAI_MODEL ?? "gpt-4o-mini";
    case "anthropic":
      return env.DEFAULT_ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest";
    case "google":
      return env.DEFAULT_GOOGLE_MODEL ?? "gemini-2.0-flash";
    default:
      return "gpt-4o-mini";
  }
}

