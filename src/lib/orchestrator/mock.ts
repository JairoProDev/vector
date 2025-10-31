import { randomUUID } from "crypto";

import { env } from "@/lib/env";
import type { ProjectPayload } from "@/types/project";

declare global {
  // eslint-disable-next-line no-var
  var __vectorMockProjects: Map<string, ProjectPayload> | undefined;
}

const mockStore = globalThis.__vectorMockProjects ?? new Map<string, ProjectPayload>();

if (process.env.NODE_ENV !== "production") {
  globalThis.__vectorMockProjects = mockStore;
}

export function hasConfiguredLLMProvider() {
  return Boolean(env.OPENAI_API_KEY || env.ANTHROPIC_API_KEY || env.GOOGLE_GENERATIVE_AI_API_KEY);
}

export function shouldUseMockOrchestrator() {
  // HACKATHON MODE: ALWAYS USE MOCK - Never fail, just simulate everything
  return true;
}

export function createMockProject({
  idea,
  projectType,
  userId,
}: {
  idea: string;
  projectType: ProjectPayload["projectType"];
  userId: string | null;
}): ProjectPayload {
  const now = new Date().toISOString();
  const id = randomUUID();
  const normalizedIdea = idea.trim();
  const headline = normalizedIdea.length > 0 ? normalizedIdea : "Describe la visión de la misión";
  const lowerHeadline = headline.toLowerCase();
  const shortTagline = headline.length > 72 ? `${headline.slice(0, 69)}…` : headline;
  const highLevelConcept = `Vector · ${shortTagline}`;

  const problemStatement = `Los equipos que buscan desarrollar ${lowerHeadline} enfrentan múltiples obstáculos críticos: parálisis por análisis excesivo, falta de estructura metodológica clara, desconexión entre la visión estratégica y la ejecución táctica, y ausencia de frameworks validados que aceleren el proceso de ideación a validación. La mayoría de founders pasan semanas o meses en ciclos improductivos, creando documentación que nunca se ejecuta, definiendo estrategias sin métricas de validación claras, y perdiendo momentum crítico en las primeras fases del proyecto. Esta desconexión entre pensamiento estratégico y acción validable genera costos de oportunidad masivos, burnout de equipo, y en muchos casos, el abandono prematuro de ideas potencialmente viables.`;

  const solutionStatement = `Vector revoluciona completamente este proceso mediante una plataforma de orquestación inteligente que transforma ${lowerHeadline} de concepto abstracto a plan ejecutable en menos de 10 minutos. Utilizamos una arquitectura multi-agente especializada que analiza la idea desde múltiples dimensiones estratégicas, genera automáticamente los artefactos clave necesarios para la validación (Lean Canvas, Roadmap de fases, Pitch estructurado, y Guías de Discovery), y proporciona un workspace integrado donde todo el contexto del proyecto vive y evoluciona. A diferencia de las herramientas tradicionales de gestión de proyectos o documentación estática, Vector actúa como un copiloto estratégico que no solo genera el plan inicial, sino que lo mantiene vivo, sugiere próximos pasos basados en el contexto, e integra feedback continuo del mercado.`;

  const uvpStatement = `Mientras que otras soluciones ofrecen plantillas muertas o requieren días de trabajo manual de estrategia, Vector combina la potencia de múltiples agentes especializados con frameworks de validación probados (Lean Startup, Jobs-to-be-Done, Design Thinking) para generar automáticamente un playbook completo y accionable para ${lowerHeadline}. La plataforma no solo documenta la estrategia, sino que orquesta el flujo completo desde análisis de problema hasta experimentos de validación, manteniendo coherencia entre todos los artefactos y actualizándolos dinámicamente a medida que el proyecto evoluciona. Esto reduce el tiempo desde idea hasta primera validación de mercado de semanas a días, aumenta dramáticamente la calidad y coherencia estratégica, y libera al equipo para enfocarse en ejecución en lugar de documentación.`;

  const metricsStatement = `Métricas de eficiencia operacional: Tiempo desde idea hasta plan ejecutable < 10 minutos (vs. 2-4 semanas tradicional). Métricas de validación: Número de experimentos de validación ejecutados por semana, tiempo hasta primera conversación con cliente real < 48 horas, porcentaje de hipótesis validadas/invalidadas mensualmente. Métricas de momentum: Consistency score del proyecto (actualizaciones semanales), progreso medible en roadmap, evolución de artefactos basada en aprendizajes. Métricas de negocio: Conversión de workspace a acción (> 80%), retención de usuarios activos (> 60%), NPS de founders (> 50), tiempo hasta fundraising o lanzamiento público.`;

  const channelsStatement = `Estrategia de distribución multicanal enfocada en founders tempranos: (1) Comunidad y contenido: Presencia activa en comunidades de founders (Y Combinator, Product Hunt, Indie Hackers, Reddit r/startups), contenido educativo "behind the build" mostrando casos reales de ${lowerHeadline}, webinars y workshops sobre metodologías de validación temprana. (2) Partnerships estratégicos: Alianzas con aceleradoras e incubadoras (Y Combinator, Techstars, 500 Startups) para ofrecer Vector como herramienta estándar en sus programas, integraciones con plataformas de ideación y gestión (Notion, Miro, Figma). (3) Growth orgánico: SEO optimizado para búsquedas de "cómo validar una startup", "lean canvas", "startup roadmap", programa de referidos para usuarios actuales, casos de estudio documentados públicamente. (4) Outreach directo: Programas de early access para founders con alta influencia, consultoría estratégica personalizada para cohorts de alto valor, presencia en eventos y conferencias de innovación y emprendimiento.`;

  const unfair = `Ventajas competitivas estructurales difíciles de replicar: (1) Arquitectura multi-agente propietaria entrenada específicamente en metodologías de startup y validación temprana, con contexto profundo sobre ${lowerHeadline} y frameworks probados. (2) Dataset único de playbooks exitosos y patrones de validación extraídos de miles de casos reales. (3) Integraciones nativas con herramientas de founders (Notion, Slack, herramientas de entrevistas, analytics) que crean lock-in natural. (4) Efecto de red: cada proyecto nuevo enriquece los modelos y mejora las recomendaciones para futuros usuarios. (5) Velocidad de iteración: capacidad de actualizar y mejorar agentes especializados semanalmente basado en feedback real. (6) Posicionamiento de marca: primeros en crear categoría de "copiloto estratégico anti-parálisis" para founders tempranos.`;

  const earlyAdopters = `Segmentos de alto valor con pain point crítico y willingness to pay validado: (1) Founders pre-seed/seed en fase de ideación-validación, típicamente técnicos sin background en estrategia, buscando estructura metodológica clara para ${lowerHeadline}. (2) Innovation labs y equipos de corporate venturing que necesitan acelerar el proceso de incubación de nuevas iniciativas. (3) Consultores estratégicos y coaches de startups que pueden usar Vector como herramienta multiplicadora para atender más clientes. (4) Programas de entrepreneurship en universidades que requieren frameworks estandarizados para enseñar validación. (5) Founders seriales que valoran velocidad y están dispuestos a pagar premium por eficiencia. Características comunes: alta familiaridad con herramientas digitales, experiencia previa con metodologías lean, networks activas donde pueden evangelizar, presupuesto para herramientas de productividad ($50-200/mes).`;

  const revenueStatement = `Modelo de monetización multi-capa diseñado para capturar valor en diferentes segmentos: (1) Freemium base: Acceso gratuito limitado a 1 proyecto con artefactos básicos, convierte ~15% a planes pagos. (2) Vector Pro ($49/mes o $470/año): Proyectos ilimitados, todos los artefactos, actualizaciones en tiempo real, integraciones premium, soporte prioritario - Target: founders individuales y equipos pequeños. (3) Vector Team ($199/mes o $1,900/año): Todo lo de Pro + colaboración multi-usuario, workspace compartido, versionado de artefactos, analytics de equipo - Target: equipos de 3-10 personas. (4) Vector Enterprise (custom pricing, ~$500-2k/mes): Soluciones white-label para aceleradoras, programas corporativos de innovación, consultoras estratégicas, incluye onboarding, customización de playbooks, y soporte dedicado. (5) Playbooks Premium ($29-99 one-time): Templates especializados por vertical o caso de uso específico. (6) Servicios de consultoría estratégica ($2k-10k): Para cohorts que necesitan acompañamiento hands-on usando Vector como plataforma central.`;

  const costStatement = `Estructura de costos cuidadosamente optimizada para mantener márgenes saludables: (1) Infraestructura tecnológica: Costos de LLM APIs (OpenAI, Anthropic, Google) con estrategia de optimización multi-provider y caching agresivo (~$5-15 por usuario activo/mes). (2) Desarrollo y producto: Equipo core de 4-6 ingenieros + 1 PM + 1 diseñador (~$80k/mes). (3) Hosting y almacenamiento: Vercel Pro + MongoDB Atlas + servicios auxiliares (~$2-5k/mes base + escala variable). (4) Marketing y adquisición: Contenido, community management, eventos, partnerships (~$15-30k/mes). (5) Operaciones y soporte: Customer success, soporte técnico, legal/accounting (~$10-20k/mes). (6) Investigación y datos: Mejora continua de modelos, dataset curation, experimentación (~$5-10k/mes). Estructura diseñada para alcanzar profitabilidad con ~500-800 clientes Pro o ~80-120 clientes Team, achievable en 12-18 meses con traction adecuada.`;

  return {
    id,
    playbookId: "vector-demo-playbook",
    projectType,
    idea,
    provider: "vector-demo",
    createdAt: now,
    updatedAt: now,
    userId,
    artifacts: {
      leanCanvas: {
        problem: problemStatement,
        customerSegments: `Founders y equipos que lanzan ${lowerHeadline} sin una guía clara en day cero.`,
        existingAlternatives:
          "Docs dispersos, plantillas en Notion y sesiones eternas sin decisiones claras.",
        solution: solutionStatement,
        uniqueValueProposition: uvpStatement,
        unfairAdvantage: unfair,
        keyMetrics: metricsStatement,
        channels: channelsStatement,
        costStructure: costStatement,
        revenueStreams: revenueStatement,
        earlyAdopters: earlyAdopters,
        highLevelConcept,
      },
      roadmap: {
        summary: `Vector estructura ${headline} en tres fases de ejecución metodológica que priorizan validación sobre construcción, aprendizaje sobre suposiciones, y momentum sobre perfección. Cada fase tiene objetivos claros, métricas de éxito medibles, experimentos específicos, e identificación proactiva de riesgos. Esta aproximación reduce dramáticamente el tiempo hasta validación de mercado, minimiza desperdicio de recursos en direcciones no validadas, y genera tracción continua con stakeholders clave (equipo, inversores, early adopters). El roadmap no es lineal ni prescriptivo, sino un framework adaptable que evoluciona basado en aprendizajes reales del mercado, manteniendo siempre el foco en la próxima acción de más alto valor para validar o invalidar hipótesis críticas del negocio.`,
        markdown: `# Roadmap Estratégico: ${headline}

## Filosofía de ejecución

Este roadmap prioriza **validación rápida sobre construcción perfecta**. Cada fase está diseñada para generar aprendizajes accionables en el menor tiempo posible, minimizando inversión hasta confirmar product-market fit. Las métricas son leading indicators de viabilidad, no vanity metrics.

---

## Fase 1 · Fundamento y Validación de Problema (Semanas 1-4)

**Objetivo principal:** Confirmar que el problema es real, severo, y que los usuarios están activamente buscando soluciones.

### Actividades clave

1. **Discovery profundo (Semana 1-2)**
   - Realizar 15-20 entrevistas de profundidad con el segmento objetivo para ${lowerHeadline}
   - Mapear el customer journey completo: desde el momento que reconocen el problema hasta que intentan resolverlo
   - Identificar pain points específicos, workarounds actuales, y willingness to pay
   - Documentar lenguaje exacto que usan los usuarios para describir el problema (critical para marketing posterior)

2. **Análisis competitivo y de alternativas (Semana 2)**
   - Inventario completo de soluciones existentes (directas e indirectas)
   - Análisis de jobs-to-be-done: ¿qué "contratan" los usuarios actualmente para resolver este problema?
   - Identificación de gaps en soluciones existentes y oportunidades de diferenciación
   - Benchmark de pricing, features, y UX de competidores

3. **Refinamiento de hipótesis (Semana 3)**
   - Actualizar Lean Canvas basado en aprendizajes de entrevistas
   - Priorizar segmentos basado en severidad de problema y accesibilidad
   - Definir propuesta de valor mínima viable que debe entregar el MVP
   - Establecer métricas de validación claras para Fase 2

4. **Preparación para construcción (Semana 4)**
   - Wireframes de baja fidelidad de experiencia core para ${lowerHeadline}
   - Definición de stack tecnológico y arquitectura inicial
   - Identificación de posibles early adopters dispuestos a testear MVP
   - Plan de comunicación para mantener warm a early adopters durante construcción

### Métricas de éxito Fase 1

- ✓ 15+ entrevistas completadas con insights accionables documentados
- ✓ 3+ patrones repetidos de pain points identificados
- ✓ 5+ early adopters comprometidos a testear MVP
- ✓ Willingness to pay validado en al menos 8 entrevistas
- ✓ Propuesta de valor refinada y testeada con usuarios reales

### Riesgos y mitigaciones Fase 1

- **Riesgo:** Sesgo de confirmación en entrevistas → **Mitigación:** Scripts con preguntas abiertas, validar con múltiples entrevistadores
- **Riesgo:** Segmento incorrecto → **Mitigación:** Entrevistar múltiples segmentos en paralelo, pivotar rápido
- **Riesgo:** Problema no suficientemente severo → **Mitigación:** Kill criteria claros, disposición a pivotar o parar

---

## Fase 2 · MVP y Primeras Validaciones (Semanas 5-12)

**Objetivo principal:** Construir la experiencia mínima que entregue valor y comenzar ciclos rápidos de aprendizaje con usuarios reales.

### Actividades clave

1. **Construcción de MVP (Semanas 5-8)**
   - Desarrollo enfocado exclusivamente en el core value proposition para ${lowerHeadline}
   - Features mínimas: lo esencial para resolver el problema identificado en Fase 1
   - Instrumentación desde día 1: analytics, user feedback tools, error tracking
   - Setup de procesos de deployment y CI/CD para iterar rápidamente

2. **Alpha testing con early adopters (Semana 9)**
   - Onboarding manual con los 5-8 early adopters identificados en Fase 1
   - Observación directa de uso, identificación de friction points
   - Recolección sistemática de feedback cualitativo
   - Iteración rápida basada en learnings (daily deploys si es necesario)

3. **Beta privada expandida (Semanas 10-11)**
   - Invitar a 20-30 usuarios adicionales del segmento objetivo
   - Implementar instrumentación cuantitativa: activación, engagement, retención
   - Establecer cadencia de comunicación con beta users (weekly updates, changelog)
   - Comenzar a testear messaging y positioning

4. **Análisis de product-market fit inicial (Semana 12)**
   - Medición formal de métricas de retención (D7, D30)
   - NPS o similar para medir amor por el producto
   - Análisis de usage patterns: qué features realmente usan, dónde abandonan
   - Decisión explícita: ¿hay suficiente señal para escalar? ¿O necesitamos pivotar?

### Métricas de éxito Fase 2

- ✓ 30+ usuarios activos en beta privada
- ✓ Retención D7 > 40% (ajustar según industria)
- ✓ NPS > 30 con early adopters
- ✓ 3+ usuarios que se auto-describen como "muy decepcionados si Vector desapareciera" (Sean Ellis test)
- ✓ Al menos 2 ciclos de iteración basados en feedback real completados

### Riesgos y mitigaciones Fase 2

- **Riesgo:** Scope creep, MVP que nunca se termina → **Mitigación:** Feature lock estricto, deadline fijo
- **Riesgo:** Falta de usuarios para testear → **Mitigación:** Pipeline de early adopters preparado en Fase 1
- **Riesgo:** Feedback contradictorio de usuarios → **Mitigación:** Segmentar feedback por tipo de usuario, priorizar signal sobre noise
- **Riesgo:** Construir features que nadie usa → **Mitigación:** Instrumentación agresiva, revisión semanal de metrics

---

## Fase 3 · Escala y Go-to-Market (Semanas 13-24)

**Objetivo principal:** Establecer canales de adquisición repetibles, construir brand awareness, y preparar el negocio para escala sostenible.

### Actividades clave

1. **Refinamiento de producto basado en beta (Semanas 13-14)**
   - Implementación de top features solicitados que soportan value proposition
   - Optimización de onboarding basado en data de abandono
   - Mejoras de performance, reliability, y UX polish
   - Preparación de materiales de marketing (screenshots, demos, casos de uso)

2. **Lanzamiento público soft (Semanas 15-16)**
   - Transición de beta privada a beta pública o early access
   - Activación de primeros canales de adquisición orgánica (SEO, content, community)
   - Lanzamiento en comunidades relevantes (Product Hunt, Indie Hackers, etc.)
   - Setup de analytics de funnel completo (awareness → signup → activation → retention)

3. **Experimentación de canales (Semanas 17-20)**
   - Testing sistemático de canales de adquisición: content marketing, partnerships, paid ads, community, etc.
   - Medición rigurosa de CAC por canal, LTV inicial, payback period
   - Iteración rápida en messaging y positioning para ${headline}
   - Construcción de procesos de customer success y support

4. **Preparación para fundraising o profitabilidad (Semanas 21-24)**
   - Consolidación de métricas clave para pitch: MRR, growth rate, retention cohorts, unit economics
   - Documentación de aprendizajes y roadmap futuro
   - Si fundraising: preparación de deck, warm intros a inversores, pitch practice
   - Si bootstrap: focus en eficiencia operacional y path to profitability

### Métricas de éxito Fase 3

- ✓ 200+ usuarios activos (o métrica relevante según negocio)
- ✓ Al menos 2 canales de adquisición con CAC < LTV identificados
- ✓ Crecimiento orgánico (word of mouth) demostrable
- ✓ Retention cohorts estables o mejorando
- ✓ Path claro a monetización o fundraising

### Riesgos y mitigaciones Fase 3

- **Riesgo:** Crecimiento sin product-market fit (leaky bucket) → **Mitigación:** Monitoring estricto de retention, no escalar si retention es pobre
- **Riesgo:** CAC insostenible → **Mitigación:** Diversificar canales, focus en orgánico early-on
- **Riesgo:** Churn alto → **Mitigación:** Customer success proactivo, entender razones de churn y corregir
- **Riesgo:** Quemar recursos demasiado rápido → **Mitigación:** Budget discipline, priorización brutal de iniciativas

---

## Principios guía para ejecutar este roadmap

1. **Aprendizaje > Perfección:** Mejor hecho que perfecto. Cada semana sin hablar con usuarios es una semana perdida.

2. **Métricas honestas:** No self-deception con vanity metrics. Retención y NPS son más importantes que signups.

3. **Rapidez de iteración:** Ciclos cortos de build-measure-learn. Deploy frecuente, feedback continuo.

4. **Focus brutal:** Decir no a todo lo que no contribuye directamente al objetivo de la fase actual.

5. **Documentar aprendizajes:** Mantener registro de hipótesis → experimento → resultado para informed decision making.`,
        phases: [
          {
            name: "Fase 1 - Descubrimiento",
            focus: "Entender profundidad del problema",
            objectives: ["Completar entrevistas", "Medir severidad"],
            keyInitiatives: ["Mapa de hipótesis", "Diarios de usuario"],
            successMetrics: ["10 entrevistas", "2 insights accionables"],
            risks: ["Segmento incorrecto", "Sesgo en respuestas"],
          },
          {
            name: "Fase 2 - MVP",
            focus: "Probar propuesta de valor",
            objectives: ["Lanzar MVP", "Obtener usuarios activos"],
            keyInitiatives: ["Desarrollo MVP", "Onboarding asistido"],
            successMetrics: ["15 usuarios activos", "Retención >30%"],
            risks: ["Experiencia incompleta", "Desalineación de expectativas"],
          },
          {
            name: "Fase 3 - Escala",
            focus: "Optimizar y crecer",
            objectives: ["Refinar oferta", "Escalar adquisición"],
            keyInitiatives: ["Iteración continua", "Experimentación en canales"],
            successMetrics: ["MRR inicial", "CAC sostenible"],
            risks: ["Crecimiento prematuro", "Costos elevados"],
          },
        ],
      },
      pitch: {
        elevatorPitch: `Imagina poder transformar ${headline} de idea abstracta a plan estratégico ejecutable en menos de 10 minutos, con Lean Canvas, roadmap de 3 fases, pitch estructurado y guías de validación generados automáticamente por agentes especializados. Vector elimina la parálisis por análisis que mata el 70% de las ideas antes de ver la luz, y te pone en la calle validando con usuarios reales en 48 horas en lugar de 3 meses planeando en un documento que nadie ejecutará. Somos el copiloto anti-parálisis que founders técnicos sin background en estrategia necesitan para pasar de "tengo una idea" a "tengo un plan validado" sin perder momentum ni quemar meses en consultoras.`,
        positioningStatement:
          `Para founders y equipos de innovación que quieren lanzar ${lowerHeadline} sin perderse en la traducción entre visión y ejecución, Vector es la plataforma de orquestación estratégica que genera automáticamente todos los artefactos críticos para validación temprana (Lean Canvas, Roadmap, Pitch, Discovery) y mantiene un workspace vivo donde el contexto completo del proyecto evoluciona con cada aprendizaje. A diferencia de herramientas tradicionales de gestión de proyectos que solo documentan, o consultoras que tardan semanas y cuestan miles, Vector combina la velocidad de automatización inteligente con la profundidad de frameworks probados (Lean Startup, Jobs-to-be-Done, Design Thinking), entregando en minutos lo que tradicionalmente toma semanas, y a una fracción del costo. Nuestro diferenciador estructural es la arquitectura multi-agente especializada que mantiene coherencia entre todos los artefactos, actualiza dinámicamente basado en feedback real, y empuja proactivamente las próximas acciones de mayor valor para validar hipótesis críticas del negocio.`,
        deckOutline: [
          "Problema: La parálisis estratégica mata más startups que la competencia",
          "Tamaño de mercado: 50M+ founders globally, $500B+ en venture capital buscando mejores startups",
          "Solución: Copiloto anti-parálisis powered by multi-agent orchestration",
          "Demo del producto: De idea a plan ejecutable en 10 minutos",
          "Tecnología: Arquitectura multi-agente y frameworks de validación integrados",
          "Modelo de negocio: Freemium + Pro ($49/mo) + Team ($199/mo) + Enterprise",
          "Tracción inicial: Early adopters, retention metrics, NPS, casos de éxito",
          "Go-to-market: Community-led growth + partnerships con aceleradoras + contenido educativo",
          "Equipo: Founders con background en AI/ML + product + growth",
          "Roadmap: Próximos 6-12-24 meses y visión a largo plazo",
          "Competencia: Por qué plantillas muertas y consultoras lentas no son suficientes",
          "Métricas clave: MRR, CAC, LTV, retención, engagement",
          "Financiamiento: Uso de fondos y milestones esperados",
          "Cierre: La visión y el call to action",
        ],
        investorHighlights: [
          `Mercado masivo y creciente: 50M+ founders globally, cada uno enfrentando el mismo problema de paralización estratégica. TAM de $10B+ considerando herramientas de productividad, consultoría estratégica, y educación para founders.`,
          `Timing perfecto: Confluence de LLMs capaces, aceptación de AI agents en workflows empresariales, y generación completa de founders técnicos sin background en estrategia que buscan atajos validados.`,
          `Ventaja técnica defensible: Arquitectura multi-agente propietaria entrenada en frameworks de validación específicos, con effect de red (cada proyecto mejora los modelos) y dataset único de playbooks exitosos.`,
          `Unit economics atractivos: CAC bajo vía community-led growth, LTV alto por lock-in natural (todo el contexto del proyecto vive en Vector), margins de 70%+ después de escala.`,
          `Moats de distribución: Partnerships con aceleradoras top-tier (YC, Techstars, 500 Startups) crean distribution advantages y brand credibility. Network effects de founders exitosos evangelizando.`,
          `Traction temprana prometedora: [Insertar métricas reales cuando estén disponibles] - Crecimiento orgánico, retención fuerte, NPS alto, early adopters vocales.`,
          `Equipo ejecutor: Founders con track record en AI/ML systems, product-market fit iteration, y growth. Advisors estratégicos de ecosistema startup.`,
          `Expansión clara del producto: Empezar con startup validation, expandir a otros verticales (libros, content channels, nuevos productos en empresas existentes), eventualmente capturar todo el lifecycle de "idea a ejecución".`,
        ],
      },
      empathy: {
        interviewQuestions: [
          // Preguntas sobre el problema y contexto
          `Cuéntame sobre la última vez que intentaste lanzar algo como ${lowerHeadline}. ¿Qué pasó?`,
          `¿Qué es lo más frustrante del proceso actual de ir desde idea hasta validación con usuarios reales?`,
          `Cuando tienes una nueva idea para ${lowerHeadline}, ¿cuáles son los primeros 3 pasos que das? ¿Dónde típicamente te atascas?`,

          // Preguntas sobre alternativas y workarounds
          `¿Qué herramientas o procesos usas actualmente para estructurar nuevas ideas? ¿Qué te gusta y qué te frustra de ellas?`,
          `¿Has trabajado con consultores estratégicos o coaches de startup? Cuéntame sobre esa experiencia.`,
          `Si no usas ninguna herramienta formal, ¿cómo documentas y compartes tu estrategia con el equipo/inversores?`,

          // Preguntas sobre métricas y éxito
          `¿Cómo decides si vale la pena continuar con una idea vs. descartarla? ¿Qué evidencia buscas?`,
          `Cuéntame sobre una experimentación temprana que hiciste bien. ¿Qué hiciste diferente?`,
          `¿Cómo mides el "progreso" de un proyecto en fase de validación, antes de tener un producto completo?`,

          // Preguntas sobre disposición a cambiar
          `¿Qué tendría que ser verdad sobre una herramienta para que la adoptes como parte central de tu proceso?`,
          `Si tuvieras un copiloto que te empuja a validar más rápido, incluso cuando eso significa salir de tu zona de confort, ¿eso sería valioso o molesto? ¿Por qué?`,
          `¿Cuánto tiempo y dinero has invertido en el último proyecto que lanzaste, desde idea hasta primera validación real con usuarios?`,

          // Preguntas sobre willingness to pay
          `¿Cuánto presupuesto mensual destinas actualmente a herramientas de productividad, gestión de proyectos, o consultoría estratégica?`,
          `Si una herramienta pudiera reducir tu tiempo desde idea hasta validación de 3 meses a 2 semanas, ¿cuánto estarías dispuesto a pagar mensualmente por eso?`,

          // Preguntas sobre contexto del usuario
          `¿Trabajas solo o en equipo? Si es en equipo, ¿cómo coordinan la estrategia y comparten contexto?`,
          `¿De dónde típicamente proviene la inspiración para nuevas ideas? ¿Conversaciones, investigación, problemas que tú mismo enfrentas?`,

          // Preguntas para entender el customer journey completo
          `Llévame paso por paso por la última idea que validaste exitosamente. ¿Qué hiciste primero, segundo, tercero?`,
          `¿En qué momento del proceso típicamente pierdes momentum o claridad sobre qué hacer siguiente?`,
          `Cuando finalmente llegas a hablar con usuarios reales, ¿qué tan preparado te sientes? ¿Tienes hipótesis claras que validar o estás más en modo exploración general?`,
        ],
        assumptionsToValidate: [
          // Hipótesis sobre el problema
          `Los founders técnicos sin background en estrategia pasan 2-4 semanas en promedio desde que tienen una idea hasta que tienen un plan estructurado y comienzan validación real.`,
          `La principal causa de abandono de ideas tempranas no es falta de calidad de la idea, sino parálisis estratégica y falta de framework claro para validar.`,
          `Equipos pierden momentum crítico en las primeras 2-4 semanas debido a documentación excesiva que nunca se ejecuta.`,

          // Hipótesis sobre la solución
          `Founders valorarían un copiloto que genera automáticamente Lean Canvas, Roadmap, Pitch, y guías de Discovery en <10 minutos por encima de plantillas estáticas o consultoría lenta.`,
          `La coherencia automática entre artefactos (Canvas → Roadmap → Pitch) generada por agentes es más valiosa que la libertad total de editar documentos independientes.`,
          `Un workspace que mantiene todo el contexto del proyecto vivo y sugiere próximos pasos crea suficiente lock-in para justificar suscripción recurrente.`,

          // Hipótesis sobre segmentación
          `El segmento más valioso son founders pre-seed/seed en sus primeras 1-3 startups, con background técnico pero sin experiencia formal en estrategia.`,
          `Innovation labs corporativos tienen mayor budget pero ciclos de venta más largos; founders individuales tienen menor LTV pero onboarding más rápido.`,
          `Consultores estratégicos pueden actuar como multiplicador (usar Vector con sus clientes) si el pricing y UX son adecuados.`,

          // Hipótesis sobre monetización
          `Disposición a pagar $49-99/mes por herramienta que reduce tiempo hasta validación de semanas a días existe en el segmento target.`,
          `Modelo freemium con límite de 1 proyecto convierte ~15-20% a planes pagos si el valor es evidente en el primer uso.`,
          `Partnerships con aceleradoras (donde aceleradora paga licencias para su cohort) es viable y acelera distribución.`,

          // Hipótesis sobre comportamiento
          `Founders revisan y actualizan sus artefactos estratégicos al menos semanalmente si la herramienta hace que sea fácil y no hay fricción.`,
          `Equipos exitosos comparten sus playbooks públicamente, generando flywheel de marketing orgánico y contenido educativo.`,
          `La primera validación con usuario real típicamente revela que 40-60% de las hipótesis iniciales estaban equivocadas, validando necesidad de frameworks de experimentación estructurados.`,
        ],
        personas: [
          "Founder técnico (ex-FAANG) en su primera startup, fase de ideación pre-seed, sin background formal en estrategia de negocio",
          "Founder serial (2-3 startups previas) que valora velocidad y busca atajos validados para no reinventar la rueda cada vez",
          "Líder de innovation lab en empresa Fortune 500, encargado de incubar 5-10 iniciativas al año con recursos limitados",
          "Product Manager en startup Serie A/B evaluando nuevas líneas de producto y necesitando validar rápidamente",
          "Consultor estratégico o coach de startups buscando herramientas para escalar su práctica y atender más clientes",
          "Profesor o coordinador de programa de entrepreneurship en universidad, necesitando frameworks estandarizados para enseñar",
          "Founder no-técnico (diseño, marketing, ops background) que se siente perdido en la fase de estructuración estratégica",
        ],
        successSignals: [
          // Señales de engagement inicial
          "Usuario completa su primer proyecto en la primera sesión y regresa dentro de 48 horas para actualizarlo basado en primeros aprendizajes",
          "Comparte el playbook generado con su co-founder, mentor, o en comunidad pública (Twitter, LinkedIn, etc.)",
          "Hace preguntas específicas sobre cómo usar Vector para su caso particular, indicando intención seria de adoptarlo",

          // Señales de retención
          "Actualiza artefactos al menos una vez por semana con nuevos aprendizajes del mercado",
          "Crea un segundo o tercer proyecto, indicando que el primer experimento fue suficientemente valioso",
          "Invita a miembros de su equipo a colaborar en el workspace, expandiendo superficie de adopción",

          // Señales de product-market fit
          "Describe como 'muy decepcionado si Vector desapareciera' en Sean Ellis test",
          "Recomienda proactivamente a otros founders sin que se le pida, indicando amor genuino por el producto",
          "Usa Vector como única fuente de verdad para estrategia del proyecto, no como complemento a otros docs",

          // Señales de monetización
          "Convierte de free a paid antes de agotar límites del plan gratuito, indicando disposición a pagar por valor percibido",
          "Upgradea a plan Team para incluir al resto del equipo en lugar de usar cuentas individuales",
          "Pregunta sobre planes Enterprise para su aceleradora/consultora, indicando intención de escalar uso",

          // Señales cualitativas
          "Reporta que Vector redujo su tiempo desde idea hasta primeras conversaciones con usuarios de semanas a días",
          "Menciona que la coherencia automática entre Canvas, Roadmap, y Pitch les salvó de inconsistencias que habrían confundido a inversores",
          "Celebra haber validado/invalidado hipótesis clave más rápido gracias a las guías de Discovery generadas",
          "Feedback negativo constructivo y específico sobre features faltantes, indicando engagement profundo y expectativas de evolución del producto",
        ],
      },
    },
    orchestratorLog: [
      {
        id: "idea",
        label: "Analizando idea",
        status: "success",
        description: `Vector interpretó las intenciones detrás de “${shortTagline}”.`,
        startedAt: now,
        finishedAt: now,
      },
      {
        id: "anchor",
        label: "Lean Canvas",
        status: "success",
        description: "Hipótesis estratégicas mapeadas y priorizadas.",
        startedAt: now,
        finishedAt: now,
      },
      {
        id: "roadmap",
        label: "Roadmap",
        status: "success",
        description: "Fases y métricas listas para ejecución.",
        startedAt: now,
        finishedAt: now,
      },
      {
        id: "pitch",
        label: "Pitch",
        status: "success",
        description: "Historia lista para inversionistas y aliados.",
        startedAt: now,
        finishedAt: now,
      },
      {
        id: "empathy",
        label: "Discovery",
        status: "success",
        description: "Experimentos de validación listos para salir a la calle.",
        startedAt: now,
        finishedAt: now,
      },
    ],
  };
}

export function storeMockProject(project: ProjectPayload) {
  mockStore.set(project.id, project);
}

export function getMockProject(id: string) {
  return mockStore.get(id);
}

