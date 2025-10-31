import { callStructuredLLM } from "@/lib/llm/generation";
import {
  empathySchema,
  leanCanvasSchema,
  pitchSchema,
  roadmapSchema,
} from "@/lib/validators/project";
import type { Playbook } from "@/lib/orchestrator/types";
import { z } from "zod";

const jsonParser = <T>(schema: z.ZodType<T>) => (raw: string) => {
  const parsed = JSON.parse(raw);
  return schema.parse(parsed);
};

export const startupPlaybook: Playbook = {
  id: "startup-aceleria-v1",
  name: "Startup Zero-to-One",
  description:
    "Playbook enfocado en founders en etapa inicial. Ancla en Lean Canvas, luego genera roadmap, pitch y guías de validación.",
  projectTypes: ["startup"],
  defaultProvider: "openai",
  defaultModel: "gpt-4o-mini",
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
- Responde SOLO con un objeto JSON válido.
- No incluyas texto fuera del JSON ni bloques de código.
- Usa este esquema exacto (todas las propiedades con cadenas de texto):
{
  "problem": string,
  "customerSegments": string,
  "existingAlternatives": string,
  "solution": string,
  "uniqueValueProposition": string,
  "unfairAdvantage": string,
  "keyMetrics": string,
  "channels": string,
  "costStructure": string,
  "revenueStreams": string,
  "earlyAdopters": string,
  "highLevelConcept": string
}

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

RESPONDE SOLO CON UN OBJETO JSON usando el siguiente esquema:
{
  "summary": string, // narrativa general del camino
  "markdown": string, // roadmap completo en Markdown con encabezados, listas y métricas
  "phases": [
    {
      "name": "Fase 1 - MVP",
      "focus": string,
      "objectives": string[],
      "keyInitiatives": string[],
      "successMetrics": string[],
      "risks": string[]
    },
    {
      "name": "Fase 2 - Versión 1",
      ...
    },
    {
      "name": "Fase 3 - Escala",
      ...
    }
  ]
}

INSTRUCCIONES:
- Define entregables claros y medibles.
- Las métricas deben ser cuantificables.
- Markdown debe incluir títulos para cada fase (##) y listas de bullets.`;

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

ENTREGA UN JSON con el siguiente formato:
{
  "elevatorPitch": string, // 3-4 frases persuasivas
  "positioningStatement": string, // frase estilo "Para X que..."
  "deckOutline": string[], // títulos de 10 slides
  "investorHighlights": string[] // bullets con datos clave para inversionistas
}

TONO:
- Confiado pero realista.
- Destaca tracción potencial y visión.
- No inventes métricas que no estén respaldadas por el canvas.`;

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

