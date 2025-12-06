# Documentación de PagoVision-API

Esta API está diseñada para procesar comprobantes de Pago Móvil venezolanos (PagomóvilBDV y otros bancos) y extraer automáticamente los datos clave de la transacción a partir de una imagen (captura de pantalla).

## Descripción General

La API funciona como un microservicio de procesamiento intensivo. Recibe una imagen, la optimiza, extrae el texto mediante OCR y utiliza estrategias de análisis específicas por banco para estructurar la información.

**Características Clave:**
*   **Arquitectura Modular:** Servicios desacoplados con Inyección de Dependencias.
*   **Alto Rendimiento:** Ejecución asíncrona (no bloqueante) y redimensionamiento inteligente de imágenes.
*   **Extensible:** Patrón Strategy para añadir nuevos bancos fácilmente.
*   **Seguro:** Autenticación vía API Key, sin logs de PII y validación estricta de inputs.

## Instalación y Ejecución

### Requisitos

*   Python 3.12+
*   Tesseract OCR instalado en el sistema.
*   Dependencias (ver `requirements.txt`): `fastapi`, `uvicorn`, `pytesseract`, `opencv-python-headless`, `pydantic-settings`.

### Configuración del Entorno

Este proyecto está diseñado para ejecutarse completamente en Docker. No es necesario instalar Python ni dependencias localmente.

### Configuración (.env)

Puedes configurar el comportamiento de la API mediante variables de entorno o un archivo `.env`:

| Variable | Descripción | Default |
| :--- | :--- | :--- |
| `MAX_FILE_SIZE_MB` | Tamaño máximo de archivo permitido (MB). | `5` |
| `LOG_LEVEL` | Nivel de detalle de los logs. | `INFO` |
| `TESSDATA_DIR` | Ruta a carpeta personalizada de modelos Tesseract (ej. `tessdata_fast`). | `None` |
| `CACHE_ENABLED` | Activa/Desactiva el caché en memoria. | `True` |
| `RATE_LIMIT_ENABLED` | Activa/Desactiva el límite de peticiones. | `True` |
| `SENTRY_DSN` | DSN de Sentry para monitoreo de errores. | `None` |
| `API_KEY` | Clave secreta para autenticar peticiones. | `dev-secret-key` |

### Ejecución

Para iniciar el servidor de desarrollo:

```bash
docker compose up --build
```

El servidor se iniciará en `http://127.0.0.1:8000`.

### Verificación de Estado

```bash
curl http://localhost:8000/health
```
Debería responder `{"status": "ok"}`.

### Ver logs

```bash
docker compose logs -f
```

## Pruebas y Verificación

### 1. Tests Automatizados
Ejecuta la suite de pruebas en un contenedor efímero:
```bash
docker compose run --rm api python -m pytest
```

### 2. Script de Demo
Prueba el sistema de extremo a extremo con una imagen de muestra:
```bash
# Usar imagen por defecto
docker compose run --rm -e PYTHONPATH=. api python scripts/demo.py

# Usar imagen personalizada (debe estar en el volumen montado, ej. en la carpeta del proyecto)
docker compose run --rm -e PYTHONPATH=. api python scripts/demo.py tests/fixtures/comprobante.jpeg
```

### 3. Verificar Estilo (Linting)
```bash
docker compose run --rm api ruff check .
```

## Uso de la API
## Autenticación

Todas las peticiones a endpoints protegidos (como `/process-ocr`) requieren el header `X-API-Key`.

**Ejemplo:**
```bash
curl -H "X-API-Key: tu-clave-secreta" ...
```

Si usas la configuración por defecto, la clave es `dev-secret-key`.

## Endpoints

### Endpoint: Procesar Comprobante

*   **URL:** `/api/v1/process-ocr`
*   **Método:** `POST`
*   **Content-Type:** `multipart/form-data`

#### Parámetros

| Nombre | Tipo | Descripción |
| :--- | :--- | :--- |
| `file` | File | Imagen del comprobante (.jpg, .png, .jpeg). Máx 5MB. |

#### Respuesta Exitosa (200 OK)

```json
{
  "ok": true,
  "data": {
    "amount": "60,00 Bs",
    "amount_value": 60.0,
    "amount_type": "BS",
    "date": "30/11/2025",
    "operation": "004395968524",
    "identification": "31548720",
    "origin": "0102****7456",
    "destination": "04121300582",
    "bankCode": "0105",
    "bankName": "BANCO MERCANTIL",
    "concept": "Pago"
  }
}
```

## Arquitectura del Proyecto

El proyecto sigue una arquitectura de capas con **Inyección de Dependencias**:

### `app/api/webhooks.py` (Controlador)
*   Maneja la petición HTTP.
*   Valida el archivo.
*   Orquesta la llamada a los servicios de forma **asíncrona** (usando `run_in_executor` para no bloquear el Event Loop).

### `app/services/image_service.py`
*   **Responsabilidad:** Preprocesamiento de imágenes.
*   **Optimizaciones:** Redimensiona imágenes grandes a 1024px (Downscaling) para ahorrar CPU.
*   **Métodos:** `preprocess(bytes, aggressive=False)`.

### `app/services/ocr_service.py` (`TesseractService`)
*   **Responsabilidad:** Interacción con el motor OCR.
*   **Interfaz:** Implementa `OCREngine` (definido en `interfaces.py`), permitiendo cambiar el motor en el futuro.
*   **Configuración:** Soporta `TESSDATA_DIR` para usar modelos optimizados.

### `app/services/parser_service.py` (`ReceiptParser`)
*   **Responsabilidad:** Lógica de negocio de extracción.
*   **Estrategia:** Delega en `bank_strategies.py` para reglas específicas por banco.
*   **Normalización:** Usa `app/utils/normalizer.py` para limpiar datos.

### `app/cache` (Sistema de Caché)
*   **Responsabilidad:** Evitar procesamiento redundante.
*   **Diseño:** Sigue el principio SRP.
    *   `hashing.py`: Genera SHA-256 del contenido de la imagen.
    *   `storage.py`: Almacena resultados en memoria (LRU).
    *   `manager.py`: Coordina las estrategias.
*   **Integración:** Se aplica transparente mediante el decorador `CachedReceiptProcessor`.

### `app/core/limiter.py` (Rate Limiting)
*   **Librería:** `slowapi`.
*   **Límite:** 60 peticiones por minuto por IP (configurable).
*   **Protección:** Evita saturación de CPU por abuso.

### Observabilidad
*   **Logs:** Formato JSON estructurado (`python-json-logger`) para fácil ingestión.
*   **Sentry:** Captura automática de excepciones si `SENTRY_DSN` está configurado.

## Flujo de Procesamiento Optimizado

1.  **Recepción:** La imagen llega al endpoint.
2.  **Downscaling:** Si es >1024px, se reduce.
3.  **OCR Async:** Tesseract se ejecuta en un hilo separado.
4.  **Parsing:** Se extraen y normalizan los datos.
5.  **Fallback:** Si faltan datos, se reintenta con preprocesamiento agresivo.
