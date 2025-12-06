# Roadmap de PagoVision-API

Este documento describe la hoja de ruta futura para el desarrollo de la API, priorizando la solidez, la integración y la escalabilidad.

## Fase 1: Solidez y Estandarización (En Progreso)
Objetivo: Reforzar la base del código, reducir acoplamiento y mejorar la calidad de datos.

- [x] **Refactorización de Mapeo de Bancos**: Centralizar códigos y nombres de bancos en un catálogo único (`app/core/bank_catalog.py`).
- [ ] **Modelado Orientado a Objetos para Bancos**: Crear una clase `Bank` que encapsule lógica específica (formatos de cuenta, patrones de referencia).
- [ ] **Validación Avanzada**: Implementar reglas de validación cruzada (ej. verificar que el formato de cuenta coincida con el banco).
- [ ] **Gestión de Errores Granular**: Tipificar excepciones de negocio para respuestas más claras.

## Fase 2: Integración y Persistencia
Objetivo: Conectar la API con servicios externos para almacenamiento y gestión.

- [ ] **Integración con Supabase**:
    - [ ] Diseño de esquema de base de datos (Transacciones, Usuarios, Logs).
    - [ ] Implementación de cliente Supabase asíncrono.
    - [ ] Almacenamiento de auditoría de OCR.
- [ ] **Gestión de Usuarios**: Ampliar el sistema de API Key para soportar usuarios con roles y cuotas.

## Fase 3: Escalabilidad y Rendimiento
Objetivo: Preparar la API para alta carga.

- [ ] **Caché Distribuido**: Migrar de caché en memoria a Redis para persistencia y compartir caché entre réplicas.
- [ ] **Colas de Tareas**: Implementar Celery/Arq para procesamiento de OCR en background (para cargas masivas).
- [ ] **Webhooks**: Notificar a clientes externos cuando el procesamiento finalice (callback URL).

## Fase 4: Observabilidad y Mantenimiento
Objetivo: Mejorar la visibilidad del sistema.

- [ ] **Métricas**: Exponer métricas Prometheus (latencia, tasa de éxito OCR por banco).
- [ ] **Dashboard**: Visualizar estado del sistema en Grafana.
- [ ] **Mejora Continua de OCR**: Entrenar modelos Tesseract específicos para fuentes bancarias venezolanas.
