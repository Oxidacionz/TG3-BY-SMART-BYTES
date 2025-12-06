# Plan Maestro de Optimización - Smart Bytes (ToroGroup)
**Objetivo:** Maximizar precisión y eficiencia usando recursos locales (Zero-Cost API).
**Estado Actual:** MVP Funcional con Tesseract + Regex Básico.

---

## 📅 Fase 1: Consolidación y Despliegue (0% - 30%)
*El objetivo es que los scrips actuales funcionen en un entorno productivo estable.*

- [x] **1.1. Configuración de Base de Datos Real (Supabase)** (Backend)
    - [x] Migrar de Mock DB a Supabase PostgreSQL.
    - [x] Crear esquema SQL final `transactions` con campos para auditoría de OCR (`raw_text`, `confidence_score`).
- [x] **1.2. Dockerización Optimizada** (Infraestructura)
    - [x] Validar que el `Dockerfile` actual instale correctamente `tesseract-ocr-spa` (español) y las dependencias de sistema.
    - [x] Reducir tamaño de imagen final (multistage build).
- [x] **1.3. Conexión Webhook WhatsApp (Integración Scraper)**
    - [x] Integrar Scraper Externo (Railway) para enviar tasas a Supabase.
    - [x] Configurar variables `_TORO` en Railway.
    - [x] Desplegar backend principal en Render (TG3 Core).
    - [ ] Conectar webhook a n8n para recibir imágenes reales y probar el flujo end-to-end.

## 🧠 Fase 2: Mejora de "Inteligencia Local" (30% - 70%)
*Mejorar los scripts actuales para acercarse a la precisión de una IA, sin usar IA.*

- [ ] **2.1. Refinamiento de Regex (Parser Service)**
    - [ ] Auditar `backend/app/services/parser_service.py`: Analizar fallos comunes en Banesco/Pago Móvil.
    - [ ] Implementar "Lógica Difusa" (Fuzzy Matching) usando librería `rapidfuzz` o `fuzzywuzzy` para detectar nombres de bancos incluso con errores de OCR (ej. "B4NESCO" -> "BANESCO").
- [ ] **2.2. Pre-procesamiento de Imagen (OpenCV)**
    - [ ] Implementar filtros de limpieza antes de pasar Tesseract: binarización, eliminación de ruido y corrección de perspectiva. Esto mejora drásticamente la lectura de números.
- [ ] **2.3. Detección de Plantillas (Template Matching)**
    - [ ] En lugar de buscar texto suelto, crear "máscaras" para comprobantes conocidos (Zelle, Banesco App). Si la imagen coincide con la estructura visual, extraer coordenadas fijas.
- [ ] **2.4. Mejoras UX/UI (Inspiración SB Financials)**
    - [ ] **Módulo de Metas de Ahorro:** Visualización de progreso de objetivos.
    - [ ] **Tutorial Interactivo:** Guía paso a paso para onboarding de operadores.
    - [ ] **Historial Financiero:** Reportes avanzados de gastos e ingresos.

## 🤖 Fase 3: IA Local Especializada (70% - 100%)
*Implementar modelos pequeños (SML - Small Language Models) on-premise si los scripts no bastan.*

- [ ] **3.1. Evaluación de Modelos SLM (Opcional)**
    - [ ] Investigar viabilidad de correr `PaddleOCR` o `EasyOCR` (más potentes que Tesseract) en el servidor actual.
    - [ ] Evaluar modelos como `Florence-2` (Microsoft) o `Qwen-VL-Chat-Int4` si se dispone de GPU, o mantenerse en CPU-friendly OCR.
- [ ] **3.2. Dataset de Entrenamiento** (Data Science)
    - [ ] Recopilar 100-200 comprobantes reales anonimizados.
    - [ ] Entrenar/Afinar (Fine-tune) un modelo ligero o simplemente calibrar los Regex con este dataset real.

## 📊 Métricas de Éxito
- Tasa de Lectura Correcta (Monto/Ref): > 90%
- Tiempo de Respuesta: < 3 segundos por imagen.
- Costo Operativo: $0 en APIs de IA.
