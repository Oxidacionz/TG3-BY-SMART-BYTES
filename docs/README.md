# Documentación del Proyecto TG3 - SmartScanner

Bienvenido a la documentación oficial del proyecto **TG3 (SmartScanner)**. Este repositorio contiene una solución completa para el escaneo, digitalización y procesamiento de comprobantes financieros bancarios utilizando Inteligencia Artificial.

## Estructura de la Documentación

En esta carpeta `docs/` encontrarás información detallada sobre cada aspecto del sistema:

- **[Arquitectura del Sistema](./ARCHITECTURE.md)**: Visión general técnica, diagrama de componentes y flujo de datos.
- **[Guía de Instalación y Configuración](./SETUP.md)**: Pasos para instalar dependencias, configurar variables de entorno y ejecutar el proyecto localmente.
- **[Referencia de la API](./API.md)**: Documentación de los endpoints del Backend, incluyendo esquemas de entrada y salida (especialmente el módulo de Escáner IA).
- **[Despliegue](./DEPLOYMENT.md)**: Guías para construir la aplicación para producción y uso de Docker.

## Resumen del Proyecto

TG3 es una aplicación web moderna que permite a los usuarios subir imágenes de comprobantes bancarios (transferencias, pago móvil, Zelle, etc.) y extraer automáticamente los datos relevantes (monto, fecha, referencia, banco) para su posterior conciliación o almacenamiento.

**Características Clave:**
- **Frontend**: React + TypeScript + TailwindCSS (Interfaz moderna y responsiva).
- **Backend**: FastAPI (Python) para alto rendimiento.
- **IA / OCR**: Integración dual.
    - **SmartScanner (Gemini AI)**: Utiliza `google-generativeai` para una extracción de datos robusta y tolerante a fallos.
    - **Legacy OCR**: Soporte para Tesseract local (en desuso/fallback).
- **Almacenamiento**: Integración preparada para Supabase/PostgreSQL.

---
*Documentación generada automáticamente por IA Agent.*
