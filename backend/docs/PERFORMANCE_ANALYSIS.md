# Análisis de Rendimiento y Optimización

Basado en los logs proporcionados, se ha realizado un análisis del rendimiento actual de la API `PagoVision`.

## 1. Diagnóstico Actual

### Métricas Observadas (Logs)
*   **Tiempo de Respuesta Promedio (Happy Path)**: ~3.5s - 4s (Solo Pase 1).
*   **Tiempo de Respuesta (Worst Case)**: **~8s - 11s** (Pase 1 fallido + Pase 2).
*   **Cache Hit**: < 100ms (Excelente).

### Cuellos de Botella Identificados

1.  **Recursos Limitados en Docker**:
    *   Configuración actual: `cpus: '1.0'`, `memory: 512M`.
    *   **Impacto**: Tesseract es intensivo en CPU. Limitarlo a 1 núcleo estrangula su rendimiento significativamente.

2.  **Estrategia de "Doble Pase" (Two-Pass)**:
    *   El sistema intenta un OCR estándar (~3.5s) y si falla, reintenta con uno agresivo (~4.5s).
    *   **Impacto**: En casos difíciles, el usuario espera la suma de ambos tiempos (~8s+).

3.  **Modelo de Tesseract**:
    *   Es probable que se esté usando el modelo estándar (`tessdata`) en lugar del modelo optimizado para velocidad (`tessdata_fast`).

4.  **Tamaño de Imagen**:
    *   Si las imágenes son de muy alta resolución (ej. cámaras de 12MP+), Tesseract tarda exponencialmente más sin aportar mejor precisión.

---

## 2. Recomendaciones de Optimización

### 🚀 Corto Plazo (Quick Wins)

#### A. Aumentar Recursos de Docker
Tesseract se beneficia del paralelismo interno.
*   **Acción**: Aumentar `cpus` a `2.0` o `4.0` en `docker-compose.yml` si el host lo permite.
*   **Estimación de Mejora**: 30-50% reducción en tiempo de OCR.

#### B. Usar `tessdata_fast`
Los modelos "Fast" de Tesseract son mucho más rápidos y ligeros, con una pérdida de precisión mínima para recibos.
*   **Acción**: Descargar `spa.traineddata` del repositorio `tessdata_fast` y configurarlo en el Dockerfile.
*   **Estimación de Mejora**: 20-40% reducción en tiempo de OCR.

#### C. Optimizar Pre-procesamiento (Downscaling)
Asegurar que las imágenes no excedan un tamaño razonable antes de pasar al OCR.
*   **Acción**: En `ImageService`, redimensionar la imagen si el ancho > 1024px o 1280px.
*   **Estimación de Mejora**: Drástica para imágenes grandes (de 5s a 1s).

### 🛠️ Mediano Plazo (Cambios de Código)

#### D. Paralelismo o "Fail Fast"
*   **Opción 1 (Paralelo)**: Ejecutar Pase 1 y Pase 2 simultáneamente usando `asyncio.gather`. Usar el resultado del Pase 1 si es bueno, si no, esperar al Pase 2. (Consume más CPU).
*   **Opción 2 (Smarter Pass)**: Si la imagen tiene cierto nivel de ruido detectable, saltar directo al Pase 2 (Agresivo) y evitar perder 3.5s en el Pase 1.

#### E. Cambiar Motor OCR
*   Considerar **PaddleOCR** (versión ligera). Suele ser más rápido y preciso que Tesseract para recibos, aunque requiere cambiar la dependencia base.

---

## 3. Plan de Acción Sugerido

1.  **Ajustar `docker-compose.yml`**: Subir límites de CPU.
2.  **Implementar Downscaling**: Verificar/Añadir redimensionamiento en `ImageService`.
3.  **Configurar `tessdata_fast`**: Actualizar Dockerfile.
