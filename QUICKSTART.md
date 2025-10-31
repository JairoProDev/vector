# 🚀 Guía Rápida - VectorIA

## ⚠️ IMPORTANTE: Ya está configurado

**Tu app ya tiene una clave de Google Gemini configurada** (creada en tu última sesión).

---

## ✅ La app está lista

Para usar el producto ahora mismo:

```bash
# 1. Reinicia el servidor (si está corriendo)
pkill -f "next dev"

# 2. Inicia el servidor de nuevo
cd vector
npm run dev

# 3. Abre tu navegador en:
# http://localhost:3000/new-project

# 4. Prueba con una idea simple:
# "Plataforma de delivery para restaurantes locales"
```

---

## 🎯 ¿Qué Esperar?

Después de hacer clic en "Generar proyecto":

1. Verás **5 pasos progresando**:
   - ✅ Analizando idea
   - ✅ Generando Lean Canvas
   - ✅ Construyendo Roadmap
   - ✅ Diseñando Pitch
   - ✅ Armando Discovery

2. En ~60-90 segundos **serás redirigido** a `/project/[id]`

3. **Verás tu Panel de Misión** con:
   - 🗂️ **Navegador de Artefactos** (izq): Lean Canvas, Roadmap, Pitch, Empathy
   - ✏️ **Lienzo Interactivo** (centro): Edita tus artefactos
   - 🤖 **Copiloto Contextual** (der): Chat IA que sabe qué artefacto estás viendo

---

## 🐛 Troubleshooting

### Error: "API key not valid"
- ✅ Asegúrate de que tu clave de Gemini es **real y recién creada**
- ✅ Verifica que esté en `.env.local` sin espacios extras
- ✅ Reinicia el servidor después de editar `.env.local`

### Error: "ERR_CONNECTION_REFUSED"
- ✅ El servidor no está corriendo → `npm run dev`
- ✅ Espera 5-10 segundos después de iniciar

### Error: "MONGODB_URI is not configured"
- ✅ Verifica que `.env.local` tenga tu URI de MongoDB
- ✅ Revisa que no tenga espacios o caracteres raros

---

## 💡 Próximos Pasos

Una vez que funcione:

1. **Prueba con ideas reales**: Experimenta con diferentes tipos de startups
2. **Edita los artefactos**: El Lean Canvas es editable, tweakéalo
3. **Usa el Copiloto**: Pregúntale cosas específicas sobre cada artefacto
4. **Itera**: Guarda cambios y vuelve cuando tengas más información

---

## 📞 ¿Necesitas Ayuda?

- Lee el README completo para detalles de arquitectura
- Revisa los logs del servidor en la terminal
- Verifica que tu API key de Gemini tenga cuota disponible

**¡A generar proyectos! 🚀**

