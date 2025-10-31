import { callStructuredLLM } from "@/lib/llm/generation";
import {
  empathySchema,
  leanCanvasSchema,
  pitchSchema,
  roadmapSchema,
} from "@/lib/validators/project";
import type { Playbook } from "@/lib/orchestrator/types";
import { jsonrepair } from "jsonrepair";
import { z } from "zod";

const jsonParser = <T>(schema: z.ZodType<T>) => (raw: string) => {
  try {
    const parsed = JSON.parse(raw);
    return schema.parse(parsed);
  } catch (error) {
    try {
      const repairedJson = jsonrepair(raw);
      if (process.env.NODE_ENV === "development") {
        console.warn("♻️ LLM JSON repaired", {
          originalLength: raw.length,
          repairedLength: repairedJson.length,
        });
      }
      const parsed = JSON.parse(repairedJson);
      return schema.parse(parsed);
    } catch (repairError) {
      if (process.env.NODE_ENV === "development") {
        console.error("❌ Failed to repair LLM JSON", repairError);
      }
      throw repairError;
    }
  }
};

export const startupPlaybook: Playbook = {
  id: "startup-aceleria-v1",
  name: "Startup Zero-to-One",
  description:
    "Playbook enfocado en founders en etapa inicial. Ancla en Lean Canvas, luego genera roadmap, pitch y guías de validación.",
  projectTypes: ["startup"],
  defaultProvider: "google",
  defaultModel: "gemini-2.0-flash",
  agents: [
    {
      id: "anchor",
      label: "Lean Canvas Anchor",
      description:
        "Analiza la idea y sintetiza un Lean Canvas completo y coherente.",
      artifactKey: "leanCanvas",
      run: async ({ context, provider, model }) => {
        const { idea, projectType } = context;
        const prompt = `Eres un consultor senior de Lean Startup. Toma la siguiente idea y genera un Lean Canvas completo.

IDEA DEL PROYECTO (${projectType}): ${idea}

INSTRUCCIONES DE FORMATO:
Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional ni marcado. Usa este esquema exacto:

{"problem": "texto", "customerSegments": "texto", "existingAlternatives": "texto", "solution": "texto", "uniqueValueProposition": "texto", "unfairAdvantage": "texto", "keyMetrics": "texto", "channels": "texto", "costStructure": "texto", "revenueStreams": "texto", "earlyAdopters": "texto", "highLevelConcept": "texto"}

CRITERIOS:
- Sé conciso pero accionable.
- Aterriza conceptos abstractos en hipótesis testeables.
- Alinea problema, segmento y propuesta de valor.`;

        const response = await callStructuredLLM({
          prompt,
          provider,
          model,
          parser: jsonParser(leanCanvasSchema),
          retryCount: 1,
        });

        return {
          key: "leanCanvas" as const,
          label: "Lean Canvas",
          data: response.data,
          raw: response.raw,
          provider: response.provider,
          model: response.model,
        };
      },
    },
    {
      id: "roadmap",
      label: "Strategic Roadmap",
      description:
        "Transforma el Lean Canvas en un roadmap de ejecución de tres fases (MVP, Versión 1 y Escala).",
      artifactKey: "roadmap",
      dependsOn: ["leanCanvas"],
      run: async ({ context, provider, model }) => {
        const leanCanvas = context.artifacts.leanCanvas;
        const prompt = `Eres un Product Manager senior. Debes convertir el siguiente Lean Canvas en un roadmap estratégico dividido en tres fases.

LEAN CANVAS:
${JSON.stringify(leanCanvas, null, 2)}

RESPONDE SOLO CON UN OBJETO JSON usando este esquema exacto:
{
  "summary": "string",
  "markdown": "string",
  "phases": [
    {
      "name": "Fase 1 - MVP",
      "focus": "string",
      "objectives": ["string"],
      "keyInitiatives": ["string"],
      "successMetrics": ["string"],
      "risks": ["string"]
    },
    {
      "name": "Fase 2 - Versión 1",
      "focus": "string",
      "objectives": ["string"],
      "keyInitiatives": ["string"],
      "successMetrics": ["string"],
      "risks": ["string"]
    },
    {
      "name": "Fase 3 - Escala",
      "focus": "string",
      "objectives": ["string"],
      "keyInitiatives": ["string"],
      "successMetrics": ["string"],
      "risks": ["string"]
    }
  ]
}

INSTRUCCIONES ADICIONALES:
- Define entregables claros y medibles.
- Las métricas deben ser cuantificables.
- El campo "markdown" debe contener el roadmap completo en formato Markdown con encabezados (##) y listas.`;

        const response = await callStructuredLLM({
          prompt,
          provider,
          model,
          parser: jsonParser(roadmapSchema),
          retryCount: 1,
        });

        return {
          key: "roadmap" as const,
          label: "Roadmap",
          data: response.data,
          raw: response.raw,
          provider: response.provider,
          model: response.model,
        };
      },
    },
    {
      id: "pitch",
      label: "Pitch Narrative",
      description:
        "A partir del Lean Canvas, crea el Elevator Pitch y agenda de un deck de 10 diapositivas.",
      artifactKey: "pitch",
      dependsOn: ["leanCanvas"],
      run: async ({ context, provider, model }) => {
        const leanCanvas = context.artifacts.leanCanvas;
        const prompt = `Eres un experto en fundraising y storytelling. Construye el pitch para esta startup.

LEAN CANVAS:
${JSON.stringify(leanCanvas, null, 2)}

RESPONDE ÚNICAMENTE CON UN JSON de este esquema:
{
  "elevatorPitch": "string",
  "positioningStatement": "string",
  "deckOutline": ["string"],
  "investorHighlights": ["string"]
}

INSTRUCCIONES ADICIONALES:
- El elevator pitch debe tener 3 a 4 frases persuasivas.
- La positioning statement sigue el formato "Para [segmento] que [necesidad]...".
- "deckOutline" debe contener exactamente 10 títulos de diapositiva.
- "investorHighlights" incluye bullets con datos clave verificables.`;

        const response = await callStructuredLLM({
          prompt,
          provider,
          model,
          parser: jsonParser(pitchSchema),
          retryCount: 1,
        });

        return {
          key: "pitch" as const,
          label: "Pitch",
          data: response.data,
          raw: response.raw,
          provider: response.provider,
          model: response.model,
        };
      },
    },
    {
      id: "empathy",
      label: "Customer Discovery",
      description:
        "Diseña entrevistas y supuestos a validar para el segmento identificado.",
      artifactKey: "empathy",
      dependsOn: ["leanCanvas"],
      run: async ({ context, provider, model }) => {
        const leanCanvas = context.artifacts.leanCanvas;
        const prompt = `Eres un experto en Design Thinking y Customer Discovery. Diseña un plan de validación.

LEAN CANVAS:
${JSON.stringify(leanCanvas, null, 2)}

RESPUESTA: Objeto JSON con el esquema:
{
  "interviewQuestions": string[],
  "assumptionsToValidate": string[],
  "personas": string[],
  "successSignals": string[]
}

ENFOQUE:
- Preguntas abiertas, no binarias.
- Enfócate en problema, comportamiento actual y disposición a pagar.
- Señala qué evidencias confirmarían o negarían la hipótesis.`;

        const response = await callStructuredLLM({
          prompt,
          provider,
          model,
          parser: jsonParser(empathySchema),
          retryCount: 1,
        });

        return {
          key: "empathy" as const,
          label: "Customer Discovery",
          data: response.data,
          raw: response.raw,
          provider: response.provider,
          model: response.model,
        };
      },
    },
  ],
};

