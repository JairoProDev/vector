# AcelerIA Genesis 🚀

**Orquestador de Proyectos con IA** - Transforma ideas nebulosas en planes accionables en minutos.

---

## 🎯 ¿Qué es?

AcelerIA Genesis es un IDE (Integrated Development Environment) de **Estrategia de Proyectos**. Como Cursor es para código, Genesis es para **ideas, startups y emprendimientos**.

### El Problema que Resolvemos

El 99% de las ideas mueren en el "Día Cero" por:
- **Abismo de la Abstracción**: No sabes cómo aterrizar tu idea
- **Niebla del Conocimiento**: No sabes qué hacer primero
- **Parálisis**: El círculo vicioso de la incertidumbre

### Nuestra Solución

Un **Orquestador de Agentes de IA** que:
1. Analiza tu idea
2. Genera un **Lean Canvas** completo
3. Crea un **Roadmap** de 3 fases (MVP → V1 → Escala)
4. Diseña un **Pitch** persuasivo
5. Arma preguntas de **Customer Discovery**

Todo en **menos de 90 segundos**.

---

## 🏗️ Arquitectura

### Backend: Orquestador de Agentes
- **Framework**: Next.js API Routes
- **Base de Datos**: MongoDB
- **Agentes de IA**: Cadena contextual (Anchor → Roadmap → Pitch → Empathy)
- **LLMs Soportados**: OpenAI, Anthropic Claude, Google Gemini

### Frontend: Panel de Misión
- **Framework**: Next.js 14 + React Server Components
- **UI**: Tailwind CSS + shadcn/ui
- **Estado**: Zustand
- **Chat IA**: Vercel AI SDK (streaming)

---

## 🚀 Getting Started

### 1. Instalación

```bash
cd genesis
npm install
```

### 2. Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# MongoDB
MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/?appName=Cluster0"

# API Keys de LLMs (al menos una es necesaria)
OPENAI_API_KEY="sk-proj-..."
GOOGLE_GENERATIVE_AI_API_KEY="AIza..."
ANTHROPIC_API_KEY="sk-ant-..."

# NextAuth (opcional para desarrollo)
NEXTAUTH_SECRET="tu-secreto-aqui-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Proveedor por defecto (opcional)
DEFAULT_LLM_PROVIDER="google"  # "openai" | "anthropic" | "google"
DEFAULT_GOOGLE_MODEL="gemini-1.5-flash-latest"
DEFAULT_OPENAI_MODEL="gpt-4o-mini"
DEFAULT_ANTHROPIC_MODEL="claude-3-5-sonnet-latest"
```

### 3. Obtener API Keys

#### Google Gemini (Recomendado - Gratis)
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Haz clic en "Create API Key"
3. Copia la clave y pégalo en `GOOGLE_GENERATIVE_AI_API_KEY`

#### OpenAI (Requiere Pago)
1. Ve a [OpenAI Platform](https://platform.openai.com/settings/organization/api-keys)
2. Crea una nueva clave
3. **Importante**: Agrega método de pago en [Billing](https://platform.openai.com/settings/organization/billing)

#### Anthropic Claude (Requiere Pago)
1. Ve a [Anthropic Console](https://console.anthropic.com/)
2. Crea una nueva clave
3. Agrega método de pago

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 5. Probar la App

1. Ve a `/new-project`
2. Escribe tu idea de startup
3. Selecciona "Startup 0 → 1"
4. Haz clic en "Generar proyecto"
5. Espera ~60-90 segundos
6. ¡Explora tus artefactos generados!

---

## 📂 Estructura del Proyecto

```
genesis/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (dashboard)/            # Rutas protegidas
│   │   │   ├── new-project/        # Crear nuevo proyecto
│   │   │   └── project/[id]/       # Panel de misión
│   │   ├── api/                    # API Routes
│   │   │   ├── projects/
│   │   │   │   ├── generate/       # Orquestador
│   │   │   │   └── [id]/           # CRUD de proyectos
│   │   │   └── chat/               # Copiloto contextual
│   │   └── page.tsx                # Landing
│   ├── components/
│   │   ├── project/
│   │   │   ├── new-project-form.tsx
│   │   │   ├── artifact-navigator.tsx
│   │   │   ├── artifact-canvas.tsx
│   │   │   └── copilot-panel.tsx
│   │   └── layout/
│   ├── lib/
│   │   ├── orchestrator/           # Motor del orquestador
│   │   │   ├── index.ts
│   │   │   └── playbooks/
│   │   │       └── startup.ts      # Playbook de startups
│   │   ├── llm/                    # Integración LLMs
│   │   │   ├── providers.ts
│   │   │   └── generation.ts
│   │   ├── models/                 # Schemas de MongoDB
│   │   ├── validators/             # Schemas de Zod
│   │   ├── auth.ts                 # NextAuth
│   │   ├── db.ts                   # Conexión MongoDB
│   │   └── env.ts                  # Variables de entorno
│   └── types/
├── .env.local                       # Tus credenciales (no versionado)
└── package.json
```

---

## 🎭 Playbooks de Agentes

Un **Playbook** define qué agentes ejecutar y en qué orden:

### Startup Playbook (Actual)
1. **Anchor Agent**: Genera Lean Canvas
2. **Roadmap Agent**: Crea roadmap de 3 fases
3. **Pitch Agent**: Diseña elevator pitch y deck outline
4. **Empathy Agent**: Arma preguntas de discovery

### Próximos Playbooks
- **Libro / Playbook**: Estructura de contenido
- **Canal de Contenidos**: Plan de crecimiento de newsletter

---

## 🔧 Tecnologías

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Zod
- **Base de Datos**: MongoDB (Mongoose)
- **IA**: Vercel AI SDK, OpenAI SDK, Anthropic SDK, Google AI SDK
- **Autenticación**: NextAuth.js
- **Estado**: Zustand
- **Markdown**: react-markdown

---

## 🚢 Deploy en Producción

### Vercel (Recomendado)

```bash
npm run build
vercel deploy
```

No olvides configurar las variables de entorno en el dashboard de Vercel.

---

## 📝 Notas Importantes

### Modelos por Defecto

- **Gemini**: `gemini-1.5-flash-latest` (rápido y económico)
- **OpenAI**: `gpt-4o-mini` (buen balance)
- **Claude**: `claude-3-5-sonnet-latest` (premium)

### Costos Estimados

Por generación completa de proyecto:
- **Gemini Flash**: ~$0.001-0.003 (casi gratis)
- **GPT-4o Mini**: ~$0.01-0.02
- **Claude Sonnet**: ~$0.03-0.05

### Autenticación

En desarrollo, Genesis usa **Credential Provider** (email/name simple).  
En producción, configura Google/GitHub OAuth en `auth.ts`.

---

## 🤝 Contribuir

Este es un MVP en desarrollo activo. Si encuentras bugs o tienes ideas:

1. Fork el repo
2. Crea una rama (`git checkout -b feature/amazing`)
3. Commit tus cambios (`git commit -m 'feat: amazing feature'`)
4. Push a la rama (`git push origin feature/amazing`)
5. Abre un Pull Request

---

## 📄 Licencia

Proprietary - Todos los derechos reservados

---

**¿Listo para generar tu primer proyecto?** 🚀

```bash
npm run dev
# Abre http://localhost:3000/new-project
```
