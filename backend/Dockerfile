
# Stage 1: Builder
# Usamos una imagen temporal para descargar e instalar paquetes de Python
# lo que nos permite descartar herramientas de compilación y caché en la imagen final.
FROM python:3.12-slim as builder

WORKDIR /app

# Variables para optimizar pip
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt .

# Instalamos las dependencias en un directorio específico (/install)
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Final Runner
# Imagen limpia que solo tendrá lo necesario para ejecutar
FROM python:3.12-slim

WORKDIR /app

# Variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

# Instalar dependencias del sistema (Runtime)
# Incluimos tesseract-ocr-spa explícitamente como se pide en el Roadmap
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-spa \
    libgl1 \
    libglib2.0-0 \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copiar las librerías de Python instaladas desde la etapa 'builder'
# Esto coloca los paquetes en /usr/local/lib/python3.12/site-packages
COPY --from=builder /install /usr/local

# Crear usuario no-root por seguridad
RUN useradd -m -u 1000 appuser

# Copiar el código de la aplicación
COPY . .

# Cambiar permisos
RUN chown -R appuser:appuser /app

# Cambiar al usuario no privilegidado
USER appuser

# Exponer el puerto
EXPOSE 8000

# Healthcheck usando curl
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Comando de inicio
# Comando de inicio compatible con Render/Railway (usa $PORT dinámico)
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
