# Guía de Pruebas con Docker para PagoVision-API

Esta guía te explica cómo levantar el servicio usando Docker y cómo probar tus propias imágenes.

## 1. Requisitos Previos

Asegúrate de tener instalados:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 2. Construir y Levantar el Servicio

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
# Construir la imagen y levantar el contenedor en segundo plano
docker compose up -d --build
```

Para ver los logs y asegurarte de que todo está funcionando:

```bash
docker compose logs -f api
```

Deberías ver algo como:
`INFO: Uvicorn running on http://0.0.0.0:8000`

## 3. Probar con tus Imágenes

Puedes usar `curl` para enviar tus imágenes al servicio.

### Comando Genérico

```bash
curl -X POST "http://localhost:8000/api/v1/process-ocr" \
  -H "accept: application/json" \
  -H "X-API-Key: dev-secret-key" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/ruta/a/tu/imagen.jpg"
```

### Ejemplo Paso a Paso

1.  **Ubica tu imagen**: Supongamos que tienes una imagen en `/home/usuario/imagenes/pago.jpg`.
2.  **Ejecuta el comando**:

```bash
curl -X POST "http://localhost:8000/api/v1/process-ocr" \
  -H "accept: application/json" \
  -H "X-API-Key: dev-secret-key" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/home/usuario/imagenes/pago.jpg"
```

> **Nota**: El `@` antes de la ruta es importante, le indica a `curl` que lea el archivo.

## 4. Detener el Servicio

Cuando termines, puedes detener los contenedores con:

```bash
docker compose down
```

## Solución de Problemas Comunes

-   **Error de conexión**: Asegúrate de que el contenedor esté corriendo (`docker ps`).
-   **Error 403 Forbidden**: Verifica que la `X-API-Key` sea correcta (por defecto es `dev-secret-key` en el `docker-compose.yml` o `.env`).
-   **Error "Missing required fields"**: La imagen debe ser legible y contener los datos mínimos (Monto, Fecha, Referencia, Banco).

## 5. Ejecutar Pruebas de Estrategia (Desarrollo)

Si deseas verificar que el sistema está clasificando correctamente los bancos y tipos de transacción (Estrategia de Evolución), puedes ejecutar el script de prueba incluido:

```bash
docker compose run --rm api python tests/test_fixtures_strategy.py
```

Este comando:
1.  Levanta un contenedor temporal de la API.
2.  Ejecuta el script `tests/test_fixtures_strategy.py`.
3.  Procesa las imágenes en `tests/fixtures/` y muestra qué estrategia se seleccionó para cada una.
4.  Elimina el contenedor al finalizar (`--rm`).

## 6. Ejecutar Suite Completa de Pruebas

Para ejecutar todas las pruebas unitarias y de integración del proyecto (incluyendo caché, rate limiting, validaciones, etc.):

```bash
docker compose run --rm -e PYTHONPATH=. api pytest
```

> **Nota:** Se usa `-e PYTHONPATH=.` para asegurar que `pytest` pueda importar correctamente el módulo `app` dentro del contenedor.
