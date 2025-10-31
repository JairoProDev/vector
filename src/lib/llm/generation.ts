import { generateText } from "ai";

import { resolveModelName, resolveProvider, type LLMProvider } from "@/lib/llm/providers";

interface BaseLLMOptions {
  provider?: LLMProvider;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  timeoutMs?: number;
}

export interface TextLLMOptions extends BaseLLMOptions {
  prompt: string;
}

export interface StructuredLLMOptions<T> extends BaseLLMOptions {
  prompt: string;
  parser: (raw: string) => T;
  retryCount?: number;
}

export async function callTextLLM({
  prompt,
  provider,
  model,
  temperature = 0.2,
  maxOutputTokens,
  timeoutMs = 45000,
}: TextLLMOptions) {
  const { provider: resolvedProvider, getModel } = resolveProvider(provider);
  const modelName = resolveModelName(resolvedProvider, model);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const result = await generateText({
      model: getModel(modelName),
      prompt,
      temperature,
      maxOutputTokens,
      abortSignal: controller.signal,
    });

    return {
      text: result.text.trim(),
      provider: resolvedProvider,
      model: modelName,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function callStructuredLLM<T>({
  prompt,
  parser,
  provider,
  model,
  temperature = 0.1,
  maxOutputTokens = 1500,
  retryCount = 2,
  timeoutMs = 60000,
}: StructuredLLMOptions<T>) {
  let lastError: unknown;
  let lastRawText: string | undefined;

  for (let attempt = 0; attempt <= retryCount; attempt += 1) {
    try {
      const { text, provider: resolvedProvider, model: resolvedModel } =
        await callTextLLM({
          prompt,
          provider,
          model,
          temperature,
          maxOutputTokens,
          timeoutMs,
        });

      lastRawText = text;
      const cleaned = extractJsonPayload(text);
      const parsed = parser(cleaned);
      return {
        data: parsed,
        raw: text,
        provider: resolvedProvider,
        model: resolvedModel,
        attempt,
      };
    } catch (error) {
      if (process.env.NODE_ENV === "development" && lastRawText) {
        console.error("⚠️ LLM structured call failed", {
          error,
          snippet: lastRawText.substring(0, 400),
        });
      }

      if (error instanceof Error && lastRawText) {
        lastError = new Error(
          `${error.message} | Raw snippet: ${lastRawText.substring(0, 400)}`,
        );
      } else {
        lastError = error;
      }
    }
  }

  throw lastError ?? new Error("LLM structured call failed without error detail");
}

function extractJsonPayload(text: string) {
  const trimmed = text.trim();
  
  // Try direct JSON first
  if (trimmed.startsWith("{")) {
    const lastBraceIndex = trimmed.lastIndexOf("}");
    if (lastBraceIndex !== -1) {
      const candidate = trimmed.slice(0, lastBraceIndex + 1);
      if (candidate.trim().startsWith("{") && candidate.trim().endsWith("}")) {
        return candidate.trim();
      }
    }
  }

  // Try to extract JSON from code blocks (```json or ```)
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1].trim();
  }

  // Try to find JSON object anywhere in the text (non-greedy with dotall)
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new Error("LLM response did not include a JSON object");
}

