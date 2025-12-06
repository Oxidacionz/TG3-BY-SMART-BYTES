# Lista de Tareas Pendientes - Smart Bytes (ToroGroup)

## 1. Configuración de Entorno (Prioridad Alta)
- [ ] **OpenAI API Key**: Configurar la variable de entorno `OPENAI_API_KEY` en el archivo `.env` o en el panel de Railway. Esto es crucial para que el Smart Scanner funcione.
- [ ] **Base de Datos (Supabase)**:
    - Crear proyecto en Supabase.
    - Obtener `SUPABASE_URL` y `SUPABASE_KEY`.
    - Ejecutar scripts de migración (aún por definir) para crear la tabla `transactions`.
    - Configurar `USE_MOCK_DB=False` en `backend/.env` para conectar a producción.

## 2. Backend & Infraestructura
- [ ] **Deploy Backend**: Desplegar la imagen Docker (`infra/Dockerfile`) en Railway/Render.
- [ ] **Configurar Webhook**: Conectar la URL pública del backend (`/api/v1/webhook/whatsapp`) en n8n o Meta Developers para recibir mensajes.
- [ ] **Seguridad**: Implementar autenticación real (JWT) en los endpoints protegidos (actualmente abiertos).

## 3. Frontend
- [ ] **Deploy Frontend**: Desplegar el frontend en Vercel/Netlify.
- [ ] **Variables de Entorno**: Configurar `VITE_API_URL` en el frontend para apuntar al backend desplegado (no a localhost).

## 4. Pruebas y Validación
- [ ] **Test de Integración**: Probar flujo completo: Foto WhatsApp -> Webhook -> AI Scanner -> DB.
- [ ] **Validación de AI**: Ajustar el `SYSTEM_PROMPT` si se detectan errores recurrentes en ciertos bancos específicos.
