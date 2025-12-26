# Reporte del Proyecto — Toro Group Financial

## Resumen
- **Propósito:** Sistema offline-first para gestión financiera con escaneo OCR de comprobantes y dashboard.
- **Lenguajes / Stack:** Backend en Python (FastAPI), Frontend en React + Vite (TypeScript), SQLite/Supabase para persistencia.
- **Estado:** Código fuente presente para backend y frontend, tests unitarios en `backend/tests`, dockerfiles y docker-compose incluidos.

## Stack Tecnológico
- **Backend:** FastAPI, Uvicorn, SQLAlchemy, pydantic-settings, pytesseract, opencv-python-headless, Pillow, slowapi (rate limiter), sentry-sdk.
  - Ver: [backend/requirements.txt](backend/requirements.txt)
- **Frontend:** React 19, Vite, Recharts, lucide-react.
  - Ver: [frontend/package.json](frontend/package.json)

## Estructura Principal
- **Entrada backend:** [backend/app/main.py](backend/app/main.py) — expone `/api/v1` y `/health`.
- **Configuración:** [backend/app/core/config.py](backend/app/core/config.py).
- **Persistencia:** Soporta Supabase y fallback SQLite en [backend/app/core/database_sb.py](backend/app/core/database_sb.py).
- **Frontend:** App en `frontend/src`, componente de scanner en [frontend/src/components/SmartScanner.tsx](frontend/src/components/SmartScanner.tsx) que postea a `/api/v1/scanner/`.

## Observaciones (Backend)
- Buena separación modular (`core`, `services`, `api/v1`, `schemas`, `utils`).
- `pydantic-settings` usado para configuración; valores por defecto (ej. `API_KEY: "dev-secret-key"`).
- OCR con Tesseract encapsulado en `TesseractService` — requiere binarios nativos en entorno (tesseract + datos de idioma).
- Rate limiting (slowapi) y Sentry opcional están integrados.
- CORS configurado como abierto: `allow_origins=["*"]` en `main.py`.

## Observaciones (Frontend)
- Interfaz rica con tutorial y modo demo; integración clara hacia backend.
- `SmartScanner` sube imágenes y espera respuesta JSON con `{ status: 'success', data }`.
- Mock data permite desarrollo sin backend.

## Tests y CI
- Existen tests en `backend/tests/` y `pytest` en `requirements.txt`.
- No se detecta pipeline CI (GitHub Actions/GitLab CI) en el repo — recomendable incluirlo.

## Riesgos y Problemas Detectados
- CORS permisivo en producción — riesgo de exposición.
- Credenciales por defecto (`dev-secret-key`) deben eliminarse u obligarse vía variables de entorno.
- Dependencias nativas para OCR requieren instalación en imagen Docker o máquina host.
- Supabase: revisar reglas de seguridad/roles y asegurar que credenciales no estén comprometidas.

## Recomendaciones
- Restringir `CORS` en producción y forzar autenticación para endpoints sensibles.
- Eliminar valores secretos por defecto y documentar variables necesarias en `.env.example`.
- Documentar instalación de `tesseract` y `tessdata` para Docker y entornos Windows/Linux.
- Añadir CI (GitHub Actions) que ejecute `ruff` o `flake8`, `pytest` y build frontend.
- Añadir pruebas de integración para el endpoint `/api/v1/scanner/`.

## Pasos Rápidos para Ejecutar Localmente

### Backend (Windows PowerShell)
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
# Configurar variables de entorno (revisar backend/app/core/config.py)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Abrir http://localhost:5173 o puerto que indique Vite
```

## Archivos Clave
- [backend/app/main.py](backend/app/main.py)
- [backend/app/core/config.py](backend/app/core/config.py)
- [backend/app/core/database_sb.py](backend/app/core/database_sb.py)
- [frontend/src/components/SmartScanner.tsx](frontend/src/components/SmartScanner.tsx)
- [frontend/src/App.tsx](frontend/src/App.tsx)

## Próximos Pasos Sugeridos
- Ejecutar tests de backend con `pytest` y reportar fallos.
- Añadir `.env.example` y un README de ejecución detallado.
- Construir un GitHub Action para lint + test + build.

---
Si deseas, puedo:
- Ejecutar `pytest` aquí y adjuntar resultados.
- Generar `.env.example` y `README_RUN.md` con pasos detallados.

Solicita la acción que prefieras.
