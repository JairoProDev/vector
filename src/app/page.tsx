import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

import {
  ArrowRight,
  Bot,
  Check,
  Compass,
  Layers,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Timer,
  Users,
  Workflow,
} from "lucide-react";

const signInPath = "/signin";
const newProjectPath = "/new-project";
const newProjectCallback = encodeURIComponent(newProjectPath);
const signInWithNewProject = `${signInPath}?callbackUrl=${newProjectCallback}`;

const navItems = [
  { label: "Visión", href: "#vision" },
  { label: "Producto", href: "#producto" },
  { label: "Playbooks", href: "#playbooks" },
  { label: "Precios", href: "#precios" },
  { label: "Preguntas", href: "#faq" },
];

const differentiators = [
  {
    title: "Claridad inmediata",
    description:
      "Transformamos tu idea en un plano estratégico en cuestión de segundos. Sin plantillas vacías, sin hojas en blanco.",
    points: [
      "Parser de intenciones que interpreta visión, modelo y riesgos",
      "Artefactos vivos con trazabilidad y estado de validación",
      "Zoom semántico para pasar de la visión macro a tareas micro",
    ],
    icon: Compass,
  },
  {
    title: "Orquestación inteligente",
    description:
      "Un enjambre de agentes de IA que discuten, priorizan y se alinean para darte el siguiente paso con confianza.",
    points: [
      "Agentes especializados en estrategia, producto, mercado, legal y técnico",
      "Resolución de conflictos y recomendaciones accionables",
      "Coach anti-parálisis que minimiza el tiempo sin progreso",
    ],
    icon: Workflow,
  },
  {
    title: "Ejecución conectada",
    description:
      "Vector sincroniza estrategia y ejecución con tus herramientas favoritas y registra cada avance en tu fuente única de verdad.",
    points: [
      "Integraciones bidireccionales con ClickUp, GitHub, Figma y más",
      "Misiones verificables con evidencia real",
      "Playbooks ejecutables que instalan mejores prácticas en minutos",
    ],
    icon: Layers,
  },
];

const steps = [
  {
    title: "Describe la visión",
    description:
      "Escribe tu idea como la contarías a un socio. El parser de intenciones entiende formato, audiencias, modelos y riesgos en segundos.",
    result: "Obtén hipótesis iniciales y un Lean Canvas dinámico al 90% completado.",
    icon: Sparkles,
  },
  {
    title: "Orquestamos el plan",
    description:
      "Agentes especializados generan artefactos estratégicos en paralelo: roadmap, análisis competitivo, experimento inicial, métricas clave.",
    result: "Recibes una vista unificada y versionada del proyecto con prioridades claras.",
    icon: Bot,
  },
  {
    title: "Valida y ejecuta",
    description:
      "Vector diseña misiones con objetivos, evidencia requerida y deadlines. El coach interviene cuando detecta parálisis o sobreanálisis.",
    result: "Cada interacción termina con una acción concreta en el mundo real.",
    icon: Timer,
  },
  {
    title: "Aprende y escala",
    description:
      "Los resultados actualizan automáticamente tus artefactos, accionan nuevos playbooks y sincronizan tareas con tus herramientas de ejecución.",
    result: "Tu estrategia evoluciona con datos reales y mantiene a tu equipo completamente alineado.",
    icon: Rocket,
  },
];

const agents = [
  {
    name: "Estratega",
    focus: "Alineación de modelo de negocio",
    outputs: ["Lean Canvas vivo", "OKRs de tracción", "Mapa de riesgos"],
  },
  {
    name: "Producto",
    focus: "Roadmap y entregables",
    outputs: ["Historias de usuario priorizadas", "Backlog de MVP", "Journeys interactivos"],
  },
  {
    name: "Mercado",
    focus: "Validación externa",
    outputs: ["Análisis competitivo", "TAM/SAM/SOM", "Playbook de go-to-market"],
  },
  {
    name: "Técnico",
    focus: "Arquitectura viable",
    outputs: ["Stack recomendado", "Diagrama de sistemas", "Checklist de escalabilidad"],
  },
  {
    name: "Legal",
    focus: "Compliance y confianza",
    outputs: ["Riesgos regulatorios", "Políticas base", "Recomendaciones de privacidad"],
  },
  {
    name: "Validador",
    focus: "Experimentos",
    outputs: ["Diseño de tests", "Métricas objetivo", "Interpretación de resultados"],
  },
  {
    name: "Coach",
    focus: "Momentum",
    outputs: ["Alertas anti-parálisis", "Plan semanal", "Resumen de progreso"],
  },
];

const playbooks = [
  {
    name: "Vector Genesis Sprint",
    description:
      "Dos semanas para pasar de idea a validación inicial. Misiones diarias, entrevistas guiadas y síntesis automática de evidencia.",
  },
  {
    name: "YC Launch Strategy",
    description:
      "Plantilla exclusiva inspirada en Y Combinator: entrevistas, métricas clave, storytelling de pitch y cronograma de lanzamiento.",
  },
  {
    name: "Enterprise Innovation Loop",
    description:
      "Operativiza la innovación corporativa: gobernanza, permisos, evaluación de riesgos y comunicación de resultados en tiempo real.",
  },
];

const pricingTiers = [
  {
    name: "Free",
    price: "0",
    description: "Para validar tu idea inicial sin fricción.",
    features: [
      "1 proyecto activo",
      "Agentes Estratega y Validador",
      "Misiones básicas e historial de decisiones",
      "Acceso a la comunidad Vector",
    ],
  },
  {
    name: "Pro",
    price: "29",
    description: "Todo lo necesario para fundadores en solitario o equipos pequeños.",
    features: [
      "Proyectos ilimitados",
      "Todos los agentes y artefactos vivos",
      "Playbooks premium incluidos",
      "Integraciones con ClickUp, GitHub y Figma",
      "Motor de validación continua",
    ],
    highlighted: true,
  },
  {
    name: "Team",
    price: "99",
    description: "Equipos que necesitan visibilidad total y sincronización continua.",
    features: [
      "Hasta 5 miembros colaboradores",
      "Roles, permisos y versiones aprobadas",
      "Dashboards de progreso en tiempo real",
      "Misiones compartidas y accountability cruzado",
      "Soporte prioritario y workshops trimestrales",
    ],
  },
];

const faqs = [
  {
    question: "¿Qué hace diferente a Vector de otras herramientas de productividad?",
    answer:
      "Vector opera antes de la ejecución. Mientras otras plataformas organizan tareas o documentos, Vector decide qué debe suceder, diseña el plan y empuja al equipo a validar. Es la capa estratégica y cognitiva donde se evita construir lo incorrecto.",
  },
  {
    question: "¿Necesito experiencia previa para usarlo?",
    answer:
      "No. Vector está diseñado para convertir inspiración en un plan guiado. Los agentes contextualizan conceptos, proponen experimentos y explican por qué cada paso es importante. Tú solo aportas la visión y la evidencia del mundo real.",
  },
  {
    question: "¿Cómo maneja Vector la confidencialidad de mi proyecto?",
    answer:
      "Utilizamos encriptación en tránsito y en reposo, controles de acceso granulados y proveedores de IA compatibles con estándares empresariales. En planes Enterprise ofrecemos despliegues dedicados, SSO/SAML y acuerdos de confidencialidad personalizados.",
  },
  {
    question: "¿Puedo integrar mis herramientas existentes?",
    answer:
      "Sí. Las integraciones bidireccionales sincronizan Roadmaps con ClickUp o Jira, activan repositorios y PR en GitHub, actualizan componentes en Figma y conectan métricas de Stripe o Mixpanel. Vector siempre refleja el estado real del proyecto.",
  },
];

const proofPoints = [
  {
    title: "Tiempo-hasta-la-Acción",
    value: "< 10 min",
    description: "Desde una idea sin estructura hasta la primera misión validada.",
  },
  {
    title: "Alineación total",
    value: "Fuente Única",
    description: "Todos comparten la misma verdad estratégica y táctica.",
  },
  {
    title: "Momentum medible",
    value: "78/100",
    description: "Score promedio de proyectos piloto gracias al coach anti-parálisis.",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-amber-500/5 via-transparent to-amber-500/5" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[60rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl lg:block" />

      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold tracking-[0.3em] text-primary">VECTOR</span>
            <span className="hidden text-sm text-muted-foreground md:inline">Sistema Operativo de la Innovación</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href={newProjectPath}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden md:inline-flex border-white/20 bg-transparent hover:border-white/40",
              )}
            >
              Usar sin cuenta
            </Link>
            <Link
              href={signInWithNewProject}
              className={cn(buttonVariants({ variant: "default", size: "sm" }), "group")}
            >
              Conectar mi cuenta
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-28 px-6 pb-32 pt-20 md:gap-36 md:pb-40 md:pt-28">
        <section className="space-y-12 text-center">
          <div className="flex justify-center">
            <Badge className="bg-primary/20 text-primary" variant="outline">
              El puente entre la visión y el progreso real
            </Badge>
          </div>
          <div className="mx-auto max-w-4xl space-y-6">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              El primer sistema operativo que reduce el costo de comenzar un proyecto de infinito a cero
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Vector interpreta tu idea, activa un equipo de agentes de IA y entrega el plan accionable que necesitas para validar en el mundo real. No es otro espacio de notas; es la torre de control que orquesta estrategia, ejecución e inteligencia.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={newProjectPath}
              className={cn(buttonVariants({ size: "lg" }), "group")}
            >
              Crear misión sin registrarme
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={signInWithNewProject}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/20 bg-transparent text-foreground hover:border-white/40",
              )}
            >
              Continuar con mi cuenta
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {proofPoints.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-lg shadow-amber-500/10 backdrop-blur"
              >
                <p className="text-sm uppercase tracking-wide text-muted-foreground">
                  {item.title}
                </p>
                <p className="mt-3 text-3xl font-semibold text-primary">{item.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="vision" className="space-y-12">
          <div className="space-y-4">
            <Badge className="bg-secondary/40 text-secondary-foreground" variant="outline">
              Visión
            </Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">
              Un intérprete universal entre la imaginación y la ejecución sostenida
            </h2>
            <p className="max-w-3xl text-lg text-muted-foreground">
              Vector resuelve la crisis de traducción entre visión, tiempo y colaboración. Aterriza ideas abstractas, reduce la niebla de lo desconocido y mantiene a todo el equipo completamente alineado con la realidad. Nuestro objetivo es optimizar la métrica más valiosa del fundador: el tiempo hasta la primera acción validada.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {differentiators.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-amber-500/10">
                <div className="flex items-center gap-3 text-primary">
                  <item.icon className="h-6 w-6" />
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{item.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="producto" className="space-y-12">
          <div className="space-y-4">
            <Badge className="bg-secondary/40 text-secondary-foreground" variant="outline">
              Cómo funciona
            </Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">
              Del caos creativo al progreso verificable en cuatro fases
            </h2>
            <p className="max-w-3xl text-lg text-muted-foreground">
              Vector no sólo te cuenta qué hacer: construye contigo, coordina a tu equipo y mide cada validación. Cada fase termina con una misión que te obliga a salir de la pantalla y volver con evidencia.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((step, index) => (
              <div key={step.title} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10" />
                <div className="relative flex items-center gap-3 text-primary">
                  <step.icon className="h-6 w-6" />
                  <span className="text-sm uppercase tracking-widest text-muted-foreground">
                    Paso {index + 1}
                  </span>
                </div>
                <h3 className="relative mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="relative mt-3 text-sm text-muted-foreground">{step.description}</p>
                <p className="relative mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
                  {step.result}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <Badge className="bg-secondary/40 text-secondary-foreground" variant="outline">
                Equipo Vector
              </Badge>
              <h2 className="text-3xl font-semibold md:text-4xl">
                Múltiples agentes, un solo copiloto de acción
              </h2>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Cada agente está entrenado para cuestionar supuestos y producir artefactos accionables. El orquestador mantiene la coherencia y prioriza las intervenciones de mayor impacto.
              </p>
            </div>
            <Link
              href={newProjectPath}
              className={cn(buttonVariants({ variant: "outline" }), "border-white/20 bg-transparent hover:border-primary/60")}
            >
              Entrar como invitado
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {agents.map((agent) => (
              <div key={agent.name} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-primary">{agent.name}</h3>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm uppercase tracking-wide text-muted-foreground">
                  {agent.focus}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {agent.outputs.map((output) => (
                    <li key={output} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-primary" />
                      <span>{output}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="playbooks" className="space-y-12">
          <div className="space-y-3">
            <Badge className="bg-secondary/40 text-secondary-foreground" variant="outline">
              Playbooks & Integraciones
            </Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">
              Estrategias programables y sincronización con tu stack
            </h2>
            <p className="max-w-3xl text-lg text-muted-foreground">
              Importa procesos desde Notion o ClickUp, instala playbooks de expertos y deja que Vector active las acciones correctas en tus herramientas existentes. Todo queda registrado en una sola narrativa estratégica.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              {playbooks.map((playbook) => (
                <div key={playbook.name} className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-primary">{playbook.name}</h3>
                    <Target className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{playbook.description}</p>
                </div>
              ))}
            </div>
            <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div>
                <h3 className="text-lg font-semibold">Integraciones profundas</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Vector empuja y recibe información de tu ecosistema de ejecución para mantener la estrategia alineada con la realidad.
                </p>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "ClickUp / Jira: sincronización de sprints y velocity",
                  "GitHub: creación de repositorios y seguimiento de commits",
                  "Figma: actualización de design systems y comentarios contextuales",
                  "Stripe & Mixpanel: KPIs financieros y comportamiento de usuarios",
                  "API Vector: expón datos a tus BI o integra agentes personalizados",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-4 w-4 flex-none text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <div className="space-y-3">
            <Badge className="bg-secondary/40 text-secondary-foreground" variant="outline">
              Casos de uso
            </Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Diseñado para cada etapa de innovación</h2>
            <p className="max-w-3xl text-lg text-muted-foreground">
              Vector es flexible por diseño. Desde pre-incubación hasta corporate venture, la plataforma ajusta agentes, playbooks y artefactos al tipo de proyecto y al nivel de madurez.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {["Startups pre-incubación", "Equipos de hackatón", "Labs corporativos", "Fondos e incubadoras"].map((segment) => (
              <div key={segment} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{segment}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Vector trae claridad, alineación y accountability multiplataforma. Importa tu contexto, instala playbooks y controla el progreso con métricas vivas.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="precios" className="space-y-12">
          <div className="space-y-3 text-center">
            <Badge className="bg-secondary/40 text-secondary-foreground" variant="outline">
              Precios
            </Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Escala tu visión con el plan adecuado</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Comienza gratis, crece con la versión Pro y desbloquea funcionalidades avanzadas de coordinación con el plan Team. Las organizaciones con requisitos específicos pueden solicitar Vector Enterprise.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-8 text-left",
                  tier.highlighted && "border-primary/60 bg-primary/10 shadow-2xl shadow-primary/20",
                )}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-semibold">{tier.name}</h3>
                  {tier.highlighted && (
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Recomendado
                    </span>
                  )}
                </div>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-semibold">${tier.price}</span>
                  <span className="text-sm text-muted-foreground">/mes</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{tier.description}</p>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 grid gap-3">
                  <Link
                    href={`${signInPath}?plan=${encodeURIComponent(tier.name)}&callbackUrl=${newProjectCallback}`}
                    className={cn(
                      buttonVariants({ variant: tier.highlighted ? "default" : "outline" }),
                      "w-full justify-center border-white/20",
                      tier.highlighted && "text-primary-foreground",
                    )}
                  >
                    Guardar mi progreso
                  </Link>
                  <Link
                    href={newProjectPath}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full justify-center border-white/10 bg-transparent hover:border-white/20",
                    )}
                  >
                    Probar en modo invitado
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h3 className="text-lg font-semibold">Enterprise & Aceleradoras</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Despliegues dedicados, agentes personalizados, SSO/SAML, dashboards de cohort y contratos Enterprise. Escríbenos para construir tu Vector OS a medida.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={newProjectPath}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white/20 bg-transparent")}
              >
                Explorar demo abierta
              </Link>
              <Link
                href={signInWithNewProject}
                className={cn(buttonVariants({ size: "lg" }), "sm:w-auto")}
              >
                Agendar consultoría estratégica
              </Link>
            </div>
          </div>
        </section>

        <section id="faq" className="space-y-12">
          <div className="space-y-3">
            <Badge className="bg-secondary/40 text-secondary-foreground" variant="outline">
              Preguntas frecuentes
            </Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Todo lo que necesitas saber para empezar</h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 p-12 text-center shadow-2xl shadow-primary/20">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Vector es el sistema nervioso central de la innovación. Comienza hoy.
            </h2>
            <p className="text-lg text-muted-foreground">
              Conecta con Google o GitHub, importa tu contexto y lanza tu misión inicial en minutos. Nuestro copiloto te guía fuera de la pantalla para validar y regresar con evidencia que evoluciona tu estrategia.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href={newProjectPath}
                className={cn(buttonVariants({ size: "lg" }), "group")}
              >
                Probar sin registrarme
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={signInWithNewProject}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white/20 bg-transparent")}
              >
                Guardar mi progreso
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-background/60 py-10 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-sm font-semibold tracking-[0.3em] text-primary">VECTOR</span>
            <p className="mt-2 text-xs text-muted-foreground">
              El sistema operativo de la innovación. De la idea al impacto, sin parálisis.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <Link href="mailto:founders@vector.so">Contacto</Link>
            <span>·</span>
            <Link href="/signin">Acceso clientes</Link>
            <span>·</span>
            <span>© {new Date().getFullYear()} Vector Technologies.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
