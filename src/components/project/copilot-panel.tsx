"use client";

import { useEffect, useMemo, useState } from "react";

import { Chat, useChat } from "@ai-sdk/react";
import { Loader2, MessageCircle, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { DefaultChatTransport } from "ai";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/store/project-store";

const suggestions: Record<string, string[]> = {
  leanCanvas: [
    "Stress testea la propuesta de valor y dame alternativas",
    "¿Qué métricas tempranas recomiendas para validar este modelo?",
    "Ayúdame a convertir el problema en insights accionables",
  ],
  roadmap: [
    "Desglosa la fase MVP en épicas y user stories",
    "¿Qué riesgos ves en la fase de escala y cómo mitigarlos?",
    "Propón experimentos rápidos para validar la fase 1",
  ],
  pitch: [
    "Refuerza el elevator pitch con más tensión de problema",
    "Sugiere gráficos clave para el deck",
    "Simula preguntas de un inversor escéptico",
  ],
  empathy: [
    "Diseña un guion de entrevista de 15 minutos",
    "¿Qué señales indicarían que debo pivotar?",
    "Propón experimentos de smoke test complementarios",
  ],
};

export function CopilotPanel() {
  const project = useProjectStore((state) => state.project);
  const selectedArtifact = useProjectStore((state) => state.selectedArtifact);

  const chat = useMemo(() => {
    const transport = new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({
        projectId: project?.id,
        artifactKey: selectedArtifact,
      }),
    });
    return new Chat({ transport });
  }, [project?.id, selectedArtifact]);

  const [input, setInput] = useState("");

  const { messages, sendMessage, setMessages, status } = useChat({ chat });

  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [selectedArtifact, setInput, setMessages]);

  const isLoading = status === "submitted" || status === "streaming";

  if (!project) {
    return null;
  }

  const quickPrompts = suggestions[selectedArtifact] ?? [];

  return (
    <Card className="sticky top-6 h-[calc(100vh-96px)] overflow-hidden border-primary/10 shadow-lg">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Copiloto contextual
        </CardTitle>
        <CardDescription>
          Pregunta con contexto automático del artefacto activo. El objetivo es enriquecer, cuestionar y empujar a ejecución.
        </CardDescription>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="rounded-full border border-dashed border-primary/30 px-3 py-1 text-xs text-primary transition hover:bg-primary/10"
              onClick={() => {
                setInput(prompt);
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-dashed border-muted-foreground/20 bg-muted/40 p-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
              <MessageCircle className="h-10 w-10 text-primary/60" />
              <p>
                ¿Por dónde quieres profundizar? Pregunta por riesgos, métricas, copy o experimentos. Vector ya entiende el artefacto activo y mantiene el contexto.
              </p>
            </div>
          )}
          {messages.map((message) => {
            const textParts = message.parts
              .filter((part) => part.type === "text")
              .map((part) => (part as { type: "text"; text: string }).text)
              .join("\n\n");
            const content = textParts || "(mensaje sin contenido textual)";
            return (
            <div
              key={message.id}
              className={cn(
                "flex flex-col gap-1 rounded-lg border px-3 py-2 text-sm",
                message.role === "user"
                  ? "ml-auto max-w-[85%] border-primary/40 bg-primary/10 text-foreground"
                  : "mr-auto max-w-[90%] border-border bg-background",
              )}
            >
              <p className="font-semibold text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {message.role === "user" ? "Tú" : "Copiloto"}
              </p>
              <div className="prose prose-sm max-w-none text-foreground">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            </div>
            );
          })}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Elaborando respuesta...
            </div>
          )}
        </div>
          <form
            className="space-y-3"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!input.trim()) return;
              await sendMessage({ text: input });
              setInput("");
            }}
          >
          <Textarea
            rows={3}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Pide ayuda concreta sobre este artefacto..."
            disabled={isLoading}
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Consejos: pregunta por riesgos, métricas accionables o siguientes experimentos.
            </p>
            <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enviar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

