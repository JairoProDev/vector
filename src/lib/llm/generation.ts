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
      lastError = error;
    }
  }

  throw lastError ?? new Error("LLM structured call failed without error detail");
}

function extractJsonPayload(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const match = trimmed.match(/\{[\s\S]*\}/);
  if (match) {
    return match[0];
  }

  throw new Error("LLM response did not include a JSON object");
}

