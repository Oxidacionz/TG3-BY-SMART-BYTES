# Referencia de API (Backend)

El Backend de TG3 expone una API RESTful documentada automáticamente por OpenAPI (Swagger).

**URL de Swagger UI**: `http://localhost:8000/docs`

## Endpoints Principales

### Scanner (SmartScanner)

- **URL**: `/api/v1/scanner/`
- **Método**: `POST`
- **Descripción**: Procesa una imagen de un comprobante bancario utilizando Inteligencia Artificial (Gemini) para extraer datos estructurados.

#### Petición (Request)
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: Archivo de imagen binario (JPG, PNG, WEBP).

#### Respuesta (Response)
- **Status**: `200 OK`
- **Content-Type**: `application/json`
- **Esquema (`TransactionReceipt`)**:

```json
{
  "platform": "BANESCO_VE",         // Enum: BANESCO_VE, MERCANTIL_VE, PAGO_MOVIL, BINANCE, ZELLE, etc.
  "amount": 1050.00,                // Decimal: Monto de la transacción
  "currency": "VES",                // Enum: VES, USD, EUR, USDT
  "reference_id": "12345678",       // String: Número de referencia / confirmación
  "transaction_date": "2023...",    // Datetime (ISO 8601) o null si no se detecta
  "sender_name": "Juan Perez",      // Opcional
  "receiver_name": "Empresa XYZ",   // Opcional
  "raw_text_snippet": "..."         // Opcional: Texto crudo relevate
}
```

#### Errores Comunes
- `400 Bad Request`: Si el archivo no es una imagen válida.
- `422 Unprocessable Entity`: Si Gemini no puede procesar la imagen (ej. imagen corrupta o error de API).
- `500 Internal Server Error`: Falta de `GEMINI_API_KEY` o error interno del servidor.

### Otros Endpoints (Referencia)

- `/api/v1/ocr/process-ocr`: Endpoint legacy (Tesseract).
- `/api/v1/stats/`: Estadísticas del dashboard.
- `/api/v1/transactions/`: Gestión CRUD de transacciones (si está habilitado con BD).
