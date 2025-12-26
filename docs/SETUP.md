# Guía de Instalación y Configuración

Sigue estos pasos para levantar el entorno de desarrollo localmente.

## Prerrequisitos

- **Python**: 3.10 o superior.
- **Node.js**: 18 o superior (con `npm`).
- **Clave API de Gemini**: Necesitas una API Key de Google AI Studio.

## 1. Configuración del Backend

1.  Navega al directorio del backend:
    ```bash
    cd backend
    ```

2.  Crea un entorno virtual (recomendado):
    ```bash
    python -m venv venv
    # En Windows:
    .\venv\Scripts\activate
    # En Mac/Linux:
    source venv/bin/activate
    ```

3.  Instala las dependencias:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configura las variables de entorno:
    - Crea un archivo `.env` en la carpeta `backend/`.
    - Agrega tu clave de Gemini:
      ```env
      GEMINI_API_KEY=tu_clave_api_aqui_xxxxxxxxxxxx
      LOG_LEVEL=INFO
      ```

5.  Inicia el servidor:
    ```bash
    uvicorn app.main:app --reload
    ```
    El servidor correrá en `http://localhost:8000`.

## 2. Configuración del Frontend

1.  Navega al directorio del frontend:
    ```bash
    cd frontend
    ```

2.  Instala las dependencias de Node:
    ```bash
    npm install
    ```

3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    El frontend estará disponible generalmente en `http://localhost:5173`.

## Verificación

1. Abre el navegador en la URL del Frontend.
2. Ve a la sección de "Escanear Comprobante".
3. Sube una imagen de prueba.
4. Si ves los datos extraídos correctamente, ¡todo está listo!

## Solución de Problemas Comunes

- **Error: `ModuleNotFoundError` en Backend**: Asegúrate de haber activado el entorno virtual antes de instalar los requirements.
- **Error: `422 Unprocessable Entity`**: Puede ser que la imagen no sea válida o el formato de archivo no sea soportado.
- **Error: `500 Internal Server Error`**: Verifica que `GEMINI_API_KEY` esté correctamente configurada en el `.env`. Revisa los logs de la consola del backend para más detalles.
