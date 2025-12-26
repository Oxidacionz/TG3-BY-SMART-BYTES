# Guía de Despliegue

Esta guía describe cómo preparar la aplicación TG3 para un entorno de producción.

## Docker (Recomendado)

El proyecto incluye un `Dockerfile` en el directorio `backend` (o raíz, dependiendo de la configuración final) para contenerizar la aplicación.

### Construir la Imagen del Backend

```bash
docker build -t tg3-backend ./backend
```

### Ejecutar el Contenedor

```bash
docker run -d \
  -p 8000:8000 \
  -e GEMINI_API_KEY="tu_clave_prod" \
  -e LOG_LEVEL="WARNING" \
  --name tg3-api \
  tg3-backend
```

## Frontend (Producción)

El Frontend es una SPA (Single Page Application) estática. Para producción, debes compilarla y servir los archivos estáticos (HTML, CSS, JS).

1.  **Construir**:
    ```bash
    cd frontend
    npm run build
    ```
    Esto generará una carpeta `dist/` con los archivos optimizados.

2.  **Servir**:
    Puedes usar cualquier servidor web estático (Nginx, Apache, Vercel, Netlify).
    
    Ejemplo con `serve` (Node):
    ```bash
    npx serve -s dist
    ```

## Variables de Entorno de Producción

Asegúrate de configurar las siguientes variables en tu servidor de producción:

- `GEMINI_API_KEY`: Crítico para el funcionamiento del escáner.
- `CORS_ORIGINS`: Lista de dominios permitidos (ej. `https://mi-app.com`) para evitar problemas de CORS.
