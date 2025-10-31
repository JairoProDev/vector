# Vector - Deployment Guide

## Quick Fix for Vercel Deployment

### ⚠️ IMPORTANT: If deploying to a subdirectory (like `/vector`)

If your site is at `https://yoursite.com/vector` instead of the root, you MUST set this environment variable in Vercel:

```
NEXT_PUBLIC_BASE_PATH=/vector
```

**How to set in Vercel:**
1. Go to your project in Vercel Dashboard
2. Settings → Environment Variables
3. Add: `NEXT_PUBLIC_BASE_PATH` with value `/vector`
4. Redeploy

Without this, your CSS and JavaScript files won't load correctly!

---

## Environment Variables for Vercel

### Required for Mock Mode (Hackathon/Demo)
```bash
# Force mock mode - works without database or LLM APIs
VECTOR_USE_MOCK_ORCHESTRATOR=true
```

### Required for Production
```bash
# Auth
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=https://yoursite.com

# At least ONE LLM provider
OPENAI_API_KEY=sk-proj-...
# OR
GOOGLE_GENERATIVE_AI_API_KEY=AIza...
# OR
ANTHROPIC_API_KEY=sk-ant-...

# Database (MongoDB)
MONGODB_URI=mongodb+srv://...

# Default provider
DEFAULT_LLM_PROVIDER=google
```

### Optional
```bash
# If deploying to subdirectory
NEXT_PUBLIC_BASE_PATH=/vector
```

---

## Local Development

1. Copy `.env.local.example` to `.env.local`
2. For quick testing, just set:
   ```bash
   VECTOR_USE_MOCK_ORCHESTRATOR=true
   ```
3. Run:
   ```bash
   npm install
   npm run dev
   ```

---

## Troubleshooting

### Styles not loading?
- Check if `NEXT_PUBLIC_BASE_PATH` is set correctly in Vercel
- Make sure it matches your deployment path

### "Cast to ObjectId failed" error?
- This should be fixed - the app now auto-detects UUIDs vs ObjectIds
- If you still see it, set `VECTOR_USE_MOCK_ORCHESTRATOR=true`

### LLM errors?
- Set `VECTOR_USE_MOCK_ORCHESTRATOR=true` to use mock data
- Or configure at least one LLM API key
