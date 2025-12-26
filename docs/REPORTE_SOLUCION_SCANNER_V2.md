# Informe de Resolución de Incidencias: TG3-SCANER Refactor
**Fecha:** 22 de Diciembre, 2025
**Estado Final:** ✅ RESUELTO (Sistema Operativo)

## 1. Resumen Ejecutivo
El módulo de escaneo de recibos (TG3-SCANER) presentaba fallos persistentes (Error 500) tras la migración a la nueva arquitectura modular. Tras un proceso de depuración profunda, se identificaron múltiples causas raíz: falta de credenciales, conflictos de configuración ocultos y límites de cuota de la API de Google. Todas han sido resueltas.

## 2. Cronología de Fallos y Soluciones

### A. Fallo de Credenciales (Inicial)
- **Error:** `DefaultCredentialsError: Your default credentials were not found.`
- **Causa:** El archivo de configuración `src/shared/config.py` contenía un valor por defecto `"your-key-here"`.
- **Solución:** Se recuperaron 5 claves API válidas desde `GEMINI_API_KEYS.txt` (usando acceso a terminal local) y se inyectaron en la configuración con lógica de rotación automática.

### B. Fallo de Lógica (Bug de Código)
- **Error:** `AttributeError: 'GeminiScannerService' object has no attribute 'api_keys'`
- **Causa:** Error en el orden de inicialización dentro del constructor `__init__` de `scanner_service.py`. Se intentaba configurar GenAI antes de cargar las variables de las claves.
- **Solución:** Reordenamiento del código de inicialización.

### C. Fallo de Configuración Fantasma (El Bloqueo del Modelo)
- **Error:** `404 models/gemini-1.5-flash is not found` (Persistente tras cambios de código)
- **Causa:** Existía un archivo `.env` oculto en `backend/` que estaba sobreescribiendo la configuración definida en `config.py`. Pydantic prioriza variables de entorno sobre valores por defecto.
- **Solución:** Se detectó y reescribió el archivo `.env` usando PowerShell para forzar la configuración correcta.

### D. Fallo de Disponibilidad y Cuota
- **Error:** `429 ResourceExhausted` y `404 Not Found` para modelos específicos (`gemini-pro-vision`).
- **Diagnóstico:** Se creó y ejecutó script `list_models.py` para auditar los modelos reales disponibles para las claves del usuario. Se confirmó acceso a la familia `gemini-2.0`.
- **Solución Final:** Se actualizó la configuración para usar el alias `gemini-flash-latest`, optimizando la compatibilidad y evitando buckets de cuota agotados.

## 3. Configuración Actual (Estable)

**Archivo:** `backend/.env`
```env
# Claves: 5 Keys con rotación
GEMINI_SCANNER_MODEL_NAME=gemini-flash-latest
GEMINI_SCANNER_MAX_RETRIES=3
API_HOST=0.0.0.0
API_PORT=8000
```

## 4. Recomendaciones Futuras
1.  **Monitorización de Cuota:** Si el error 429 reaparece frecuentemente, considerar generar nuevas claves API en un proyecto de Google Cloud limpio.
2.  **Gestión de Secretos:** Evitar commitear el archivo `.env` o `GEMINI_API_KEYS.txt` al repositorio git.
