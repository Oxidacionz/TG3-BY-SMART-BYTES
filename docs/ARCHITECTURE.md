# Arquitectura del Sistema TG3

Este documento describe la arquitectura técnica de alto nivel de la aplicación TG3.

## Diagrama de Componentes

La aplicación sigue una arquitectura cliente-servidor clásica, desacoplada mediante una API RESTful.

```mermaid
graph TD
    Client[Cliente Web (Navegador)]
    
    subgraph Frontend [Frontend (Vite + React)]
        UI[Interfaz de Usuario]
        State[Gestión de Estado (Hooks)]
        API_Client[Cliente HTTP (Fetch/Axios)]
    end
    
    subgraph Backend [Backend (FastAPI)]
        Router[API Router (v1)]
        ScannerService[Servicio SmartScanner]
        OCRService[Servicio OCR (Legacy)]
        Models[Pydantic Schemas]
    end
    
    subgraph External_Services [Servicios Externos]
        Gemini[Google Gemini API]
        Supabase[(Base de Datos / Supabase)]
    end

    Client --> UI
    UI --> State
    State --> API_Client
    API_Client -- "POST /api/v1/scanner" --> Router
    
    Router --> ScannerService
    ScannerService -- "Generar Contenido (Imagen)" --> Gemini
    Gemini -- "JSON Estructurado" --> ScannerService
    
    ScannerService --> Router
    Router -- "JSON Response" --> API_Client
```

## Descripción de Componentes

### 1. Frontend
- **Tecnología**: React, TypeScript, TailwindCSS, Vite.
- **Responsabilidad**:
  - Proporcionar una interfaz intuitiva para la carga de imágenes ("drag & drop" o cámara).
  - Previsualizar el comprobante.
  - Enviar la imagen al backend.
  - Mostrar los datos extraídos (Monto, Banco, Referencia) al usuario para su validación.

### 2. Backend
- **Tecnología**: Python 3.11+, FastAPI.
- **Estructura**:
  - `app/api/v1/endpoints`: Definición de rutas (endpoints).
  - `app/services`: Lógica de negocio.
    - `ai_scanner.py`: Servicio principal que interactúa con Google Gemini.
    - `ocr_service.py`: Servicio legacy basado en Tesseract.
  - `app/schemas`: Modelos de datos (Pydantic) para validación estricta de entradas y salidas.
  - `app/core`: Configuración (Settings, Prompts).

### 3. Servicios de Inteligencia Artificial
- **Google Gemini (Integration Actual)**:
  - Modelo: `gemini-1.5-flash`.
  - Función: Recibe la imagen y un System Prompt diseñado para extraer datos financieros. Retorna un JSON estructurado.
- **Tesseract (Legacy/Fallback)**:
  - Motor OCR local. Requiere instalación de binarios en el servidor. Se mantiene por compatibilidad o respaldo.

## Flujo de Datos (Escaneo)

1. **Upload**: El usuario sube una imagen desde el Frontend.
2. **Request**: Se envía una solicitud `POST` a `/api/v1/scanner/` con el archivo como `multipart/form-data`.
3. **Processing**:
   - El Backend recibe el archivo.
   - `SmartScannerService` prepara la imagen y el prompt.
   - Se invoca a la API de Google Gemini.
4. **Extraction**: Gemini analiza la imagen visualmente y extrae los campos clave (Monto, Fecha, Referencia, Banco) basándose en reglas visuales (logos, colores).
5. **Validation**: El backend valida el JSON recibido contra el esquema `TransactionReceipt`.
6. **Response**: Se devuelve el objeto JSON validado al Frontend.
