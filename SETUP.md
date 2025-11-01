# Vector MVP - Setup Guide

¡Felicidades por ganar la hackathon! 🎉 Este guide te ayudará a convertir Vector de un demo a un MVP funcional con usuarios reales.

## 🚀 Quick Start

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo y configúralo:

```bash
cp .env.example .env.local
```

### 3. Configurar Servicios Requeridos

#### A. MongoDB (Base de Datos) - REQUERIDO

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita (tier M0 es suficiente para empezar)
3. Crea un nuevo cluster
4. Configura un usuario de base de datos
5. Whitelista tu IP (o usa `0.0.0.0/0` para desarrollo)
6. Obtén tu connection string y actualiza `MONGODB_URI` en `.env.local`

**Formato del connection string:**
```
mongodb+srv://usuario:password@cluster.mongodb.net/vector?retryWrites=true&w=majority
```

#### B. LLM Provider - REQUERIDO (al menos uno)

Elige AL MENOS UNO de los siguientes providers:

##### Opción 1: Google Gemini (RECOMENDADO - es gratis)

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea un API key (es gratuito)
3. Actualiza `GOOGLE_GENERATIVE_AI_API_KEY` en `.env.local`
4. Establece `DEFAULT_LLM_PROVIDER="google"`

**Ventajas:**
- ✅ GRATUITO con límites generosos
- ✅ Excelente calidad (Gemini 2.0 Flash)
- ✅ Rápido
- ✅ Ideal para MVP

##### Opción 2: OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crea un API key
3. Agrega créditos a tu cuenta ($5-10 es suficiente para empezar)
4. Actualiza `OPENAI_API_KEY` en `.env.local`
5. Establece `DEFAULT_LLM_PROVIDER="openai"`

**Costo aproximado por proyecto generado:** ~$0.05-0.15 con `gpt-4o-mini`

##### Opción 3: Anthropic Claude

1. Ve a [Anthropic Console](https://console.anthropic.com/)
2. Crea un API key
3. Agrega créditos a tu cuenta
4. Actualiza `ANTHROPIC_API_KEY` en `.env.local`
5. Establece `DEFAULT_LLM_PROVIDER="anthropic"`

#### C. NextAuth Secret - REQUERIDO

Genera un secret seguro:

```bash
openssl rand -base64 32
```

Copia el output y actualiza `NEXTAUTH_SECRET` en `.env.local`

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🧪 Verificar que Todo Funciona

### Test 1: Verificar Configuración

El sistema automáticamente detecta si las configuraciones están correctas:

- ✅ Si `MONGODB_URI` y al menos un LLM provider están configurados → **Modo Producción**
- ⚠️ Si falta alguna configuración → **Modo Demo** (usa mocks)

Revisa los logs de la consola cuando arrancas el servidor para ver qué modo está activo.

### Test 2: Generar un Proyecto Real

1. Ve a "Nuevo Proyecto"
2. Describe una idea (ej: "Una app de recetas saludables para millennials")
3. Haz clic en "Lanzar misión"
4. **Deberías ver:**
   - Progreso real de agentes (tarda 30-60 segundos)
   - Logs en consola indicando llamadas a LLM
   - Proyecto guardado en MongoDB
   - Badge que dice "Demo orquestada" o similar si está en modo producción

### Test 3: Verificar Persistencia

1. Recarga la página del proyecto
2. El proyecto debe cargarse desde MongoDB (no de mock)
3. Edita un artefacto y guarda
4. Recarga - los cambios deben persistir

## 📊 Arquitectura del MVP

```
┌─────────────────────────────────────────────────────────────┐
│                     USUARIO (Browser)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js App Router                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ /new-project │  │ /project/[id]│  │  /api/*      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────┬──────────────────────────────┬─────────────────┘
             │                              │
             ▼                              ▼
┌─────────────────────────┐  ┌─────────────────────────────┐
│  Orchestrator Engine    │  │      MongoDB Atlas          │
│  ┌─────────────────┐    │  │  ┌────────────────────┐    │
│  │ Startup Playbook│    │  │  │  Projects Collection│    │
│  └─────────────────┘    │  │  └────────────────────┘    │
│    4 Agentes:           │  │  - Persistencia real       │
│    1. Lean Canvas       │  │  - Queries con Mongoose    │
│    2. Roadmap           │  │  - Full CRUD               │
│    3. Pitch             │  │  └────────────────────┘    │
│    4. Discovery         │  │                             │
└────────────┬────────────┘  └─────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                  LLM Providers (Vercel AI SDK)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Google  │  │  OpenAI  │  │ Anthropic│                  │
│  │  Gemini  │  │  GPT-4   │  │  Claude  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 Debugging

### Modo Demo vs. Producción

Para verificar en qué modo estás:

```bash
# Revisa los logs cuando arranca el servidor
npm run dev
```

Busca en la consola:
- `[Vector] Using mock orchestrator (demo mode)` → Modo Demo (falta configuración)
- `[Vector] Starting real orchestration` → Modo Producción (todo configurado)

### Forzar Modo Demo (Testing)

Si quieres testear el modo demo incluso con todo configurado:

```bash
# En .env.local
VECTOR_FORCE_DEMO="true"
```

### Logs Útiles

El sistema loggea todo el proceso de orquestación:

```
[Vector] ▶️ Ejecutando agente {"id":"anchor","label":"Lean Canvas","provider":"google"}
[Vector] ✅ Agente completado {"id":"anchor","provider":"google","model":"gemini-2.0-flash"}
[Vector] ▶️ Ejecutando agente {"id":"roadmap",...}
```

### Errores Comunes

#### "MONGODB_URI is not configured"
- Verifica que `.env.local` existe
- Verifica que `MONGODB_URI` está correctamente configurado
- Reinicia el servidor después de cambiar `.env.local`

#### "OpenAI provider selected but OPENAI_API_KEY is not configured"
- Si `DEFAULT_LLM_PROVIDER="openai"`, necesitas `OPENAI_API_KEY`
- O cambia a otro provider que sí tengas configurado

#### "Invalid environment configuration"
- Hay un error de sintaxis en `.env.local`
- Verifica que no haya espacios extra o comillas mal cerradas

## 🚢 Deploy a Producción (Vercel)

### 1. Push a GitHub

```bash
git add .
git commit -m "MVP ready for production"
git push origin main
```

### 2. Conecta a Vercel

1. Ve a [Vercel](https://vercel.com)
2. Importa tu repositorio de GitHub
3. Vercel detectará automáticamente que es Next.js

### 3. Configura Environment Variables

En Vercel Dashboard → Settings → Environment Variables, agrega:

```
MONGODB_URI=mongodb+srv://...
GOOGLE_GENERATIVE_AI_API_KEY=AIza...  (o el provider que uses)
DEFAULT_LLM_PROVIDER=google
NEXTAUTH_SECRET=tu-secret-generado
NEXTAUTH_URL=https://tu-app.vercel.app
NODE_ENV=production
```

### 4. Deploy

Vercel automáticamente deploya en cada push a `main`.

## 📈 Próximos Pasos

Ahora que tienes un MVP funcional:

1. **Testing con Usuarios Reales**
   - Invita a 5-10 founders a probar
   - Observa cómo usan el producto
   - Recopila feedback

2. **Métricas Clave a Medir**
   - Tiempo promedio de generación de proyecto
   - Tasa de activación (usuarios que completan su primer proyecto)
   - Retención D7 (usuarios que regresan en 7 días)
   - NPS (Net Promoter Score)

3. **Iteraciones Prioritarias**
   - Mejorar prompts basado en feedback
   - Agregar más tipos de proyecto (libro, contenido, etc.)
   - Implementar colaboración en equipo
   - Monetización (Stripe integration)

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs en consola (browser y servidor)
2. Verifica que todas las env variables están configuradas
3. Prueba en modo demo para aislar el problema
4. Revisa la documentación de los providers (OpenAI, MongoDB, etc.)

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Google AI Studio](https://ai.google.dev/)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

¡Éxito con tu MVP! 🚀
