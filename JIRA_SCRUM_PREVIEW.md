## Plan Scrum / Jira - Proyecto Toro Group Financial

Objetivo: Proporcionar un plan práctico, visual y comentable para gestionar este proyecto en Jira usando Scrum.

---

**Resumen rápido:**
- Equipo sugerido: Product Owner (PO), Scrum Master (SM), 2-4 Desarrolladores (backend/frontend), 1 QA/DevOps (rotativo).
- Sprint sugerido: 2 semanas.
- Herramientas: Jira (board Scrum), Confluence (docs), GitHub (repo), Docker, GitHub Actions para CI.

---

1) Epics principales (alta prioridad)

- Epic: Infra & Entorno
  - Descripción: Configurar entorno local, Docker, CI, `.env.example` y scripts de arranque.
- Epic: OCR & Scanner
  - Descripción: Integración OCR (Tesseract), endpoint `/api/v1/scanner/`, manejo de imágenes, validaciones.
- Epic: Rates & Persistencia
  - Descripción: Scrapers (BCV/Binance), almacenamiento en Supabase/SQLite y API para tasas.
- Epic: API & Backend Core
  - Descripción: Endpoints CRUD para transacciones, autenticación, rate limiter, tests unitarios.
- Epic: Frontend UI/UX
  - Descripción: Dashboard, SmartScanner UI, login/demo mode, forms, validaciones.
- Epic: Tests, Seguridad & Observabilidad
  - Descripción: Tests (pytest + front), Sentry, logging, políticas de CORS y secrets.

---

2) Backlog inicial (historias ejemplo)

- [OCR-1] Como operador quiero subir una imagen para que el OCR extraiga campos básicos (monto, referencia, fecha), para ahorrar tiempo.
  - AC: POST `/api/v1/scanner/` devuelve { status: 'success', data: { amount, reference_id, platform, raw_text_snippet }}.
  - Estimación: 5 SP

- [API-1] Crear endpoint GET `/api/v1/stats/` que devuelva `ticker` y `chart_data`.
  - AC: Endpoint protegido por API_KEY opcional, devuelve estructura esperada por frontend.
  - Estimación: 3 SP

- [FE-1] Integrar `SmartScanner` para subir imagen y mapear respuesta a formulario de transacción.
  - AC: Formulario se llena automáticamente con datos devueltos.
  - Estimación: 3 SP

- [INFRA-1] Dockerizar backend y frontend + docker-compose con servicios mínimos (postgres/sqlite/supabase mock).
  - AC: `docker-compose up` levanta servicios y la app funciona en local.
  - Estimación: 8 SP

- [TEST-1] Añadir tests unitarios para `get_latest_rates()` y endpoint `/api/v1/scanner/` usando `pytest` y `httpx`.
  - Estimación: 5 SP

---

3) Propuesta de 3 Sprints (2 semanas cada uno)

- Sprint 0 (preparación - 1 semana) - Setup y prioridades
  - Tareas:
    - `INFRA-1`: Docker + `.env.example` + scripts `start-dev.ps1`/`start-dev.sh`.
    - Añadir `REPORTE_PROYECTO.md` (hecho) y una página Confluence con requerimientos.
    - Decidir sprint length y personas.
  - Objetivo: Tener entorno reproducible y backlog priorizado.

- Sprint 1 (núcleo OCR + API básico)
  - Tareas:
    - `OCR-1`: Implementar endpoint scanner y `TesseractService` (ajustes de psm/oem).
    - `API-1`: Stats endpoint + rates adapter básico (SQLite fallback).
    - `FE-1`: Integración básica `SmartScanner` -> formulario.
  - Objetivo: Fluir fin a fin: subir imagen -> backend procesa -> frontend muestra datos.

- Sprint 2 (persistencia y scrapers)
  - Tareas:
    - Implementar `database_sb` supabase adapter + migraciones (o mejorar SQLite fallback).
    - Scrapers: `bcv_scraper`, `binance_scraper` tareas periódicas (cron / endpoint force-refresh).
    - Tests básicos y CI pipeline (unit tests + lint).
  - Objetivo: Datos de tasas persistentes y recuperables; CI mínimo activo.

- Sprint 3 (UX, seguridad y observabilidad)
  - Tareas:
    - Dashboard polish, charts, demo-mode features.
    - Restringir CORS, forzar `API_KEY`, configurar Sentry (staging keys).
    - End-to-end tests para flujo scanner->crear transacción.
  - Objetivo: Producto listo para demo con monitoreo y políticas básicas de seguridad.

---

4) Plantilla de ticket (usar como Issue Type: Story / Bug / Task)

- Título: [EPIC-CODE] Breve descripción
- Descripción:
  - Qué: (breve)
  - Por qué: (valor)
  - Cómo: (breve implementación técnica sugerida)
- Criterios de aceptación (AC):
  - 1) ...
  - 2) ...
- Dependencias: listadas
- Estimación: X SP
- Labels: backend/frontend/infra/ocr/critical

Checklist (sub-tasks):
- [ ] Implementar código
- [ ] Tests unitarios
- [ ] Documentación `.md` / Confluence
- [ ] Revisar PR
- [ ] Merge y despliegue en staging

---

5) Definición de Done (DoD)

- Código revisado en PR y aprobado.
- Tests unitarios relevantes pasan y cobertura no disminuye en >5%.
- Documentación mínima actualizada (README o Confluence).
- Build/CI pasa y app arranca en entorno local o staging.

---

6) Ceremonias y cadencia

- Daily standup: 15' (cada día laboral).
- Sprint Planning: 2 horas (al inicio de sprint).
- Sprint Review + Demo: 1 hora (al finalizar sprint).
- Sprint Retrospective: 45-60 minutos.

---

7) Tablero Jira - columnas recomendadas

- Backlog
- Selected for Sprint
- To Do
- In Progress
- In Review
- QA
- Done

Etiquetas para facilitar filtros: `epic/infra`, `epic/ocr`, `priority/high`, `type/bug`.

---

8) Visual rápido (lista compacta por Epic -> Historias -> Sprint)

- Infra & Entorno
  - INFRA-1 (Sprint0)
  - CI/CD (Sprint2)
- OCR & Scanner
  - OCR-1 (Sprint1)
  - OCR improvements (Sprint2)
- Rates & Persistencia
  - Rates adapter (Sprint1)
  - Scrapers (Sprint2)
- Frontend
  - FE-1 (Sprint1)
  - Dashboard polish (Sprint3)

---

9) Preguntas para el PO / decisiones necesarias

- ¿Sprint length 1 o 2 semanas? (recomiendo 2 semanas)
- Tamaño del equipo real (devs + QA + roles)?
- ¿Prioridad entre OCR vs persistencia de tasas?
- ¿Usaremos Supabase en prod o SQLite/Postgres?
- ¿Hay requerimientos regulatorios para datos financieros (retención, auditoría)?

---

10) Cómo usar este archivo

- Añade comentarios puntuales en este archivo (VSCode) junto a las secciones que quieras discutir.
- Puedo transformar cada historia en issues de Jira si me das acceso o un CSV/plantilla.
- Puedo generar plantillas de PR, `.env.example`, y `README_RUN.md` automáticamente.

---

11) Comentarios

- Añade tus preguntas como comentarios en este archivo o dime si quieres que convierta el Backlog inicial a issues de Jira directamente.

*** Fin del preview
