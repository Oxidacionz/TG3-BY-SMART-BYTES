# Manual de Integración: Sistema Automatizado de Comprobantes (WhatsApp + n8n + Python)

Este documento detalla paso a paso cómo integrar la recepción de imágenes desde un grupo de WhatsApp, procesarlas automáticamente y enviarlas a tu backend para extracción de datos.

## 🏗️ Arquitectura
1. **WhatsApp (Origen):** Recibe la imagen del comprobante.
2. **WAHA (WhatsApp API Local):** Un contenedor que "lee" tu WhatsApp y dispara eventos.
3. **n8n (Orquestador):** Recibe el evento de WAHA, descarga la imagen y se la da a tu Backend.
4. **Backend Python (Inteligencia):** Usa Tesseract (ya instalado) para leer el comprobante y devuelve los datos estructurados.

---

## 🚀 FASE 1: Instalación del Entorno (Infraestructura)

Como nunca has usado n8n, vamos a usar **Docker Compose**. Esto descarga e instala todo automáticamente sin configurar bases de datos manualmente.

### Paso 1: Requisito Previo
Asegúrate de tener **Docker Desktop** instalado y corriendo en tu Windows.

### Paso 2: Ejecutar los Contenedores
He creado el archivo `infra/docker-compose-n8n.yml` en tu proyecto.
1. Abre una terminal en la carpeta `TG2`.
2. Ejecuta el siguiente comando para encender n8n y WAHA:
   ```powershell
   docker-compose -f infra/docker-compose-n8n.yml up -d
   ```
3. Espera unos minutos.

### Paso 3: Conectar tu WhatsApp
1. Abre tu navegador en: `http://localhost:3000/dashboard` (Panel de WAHA).
2. Verás un código QR (Scan QR).
3. Abre WhatsApp en tu celular -> Dispositivos Vinculados -> Vincular Dispositivo.
4. Escanea el código QR de la pantalla.
   * ✅ **Resultado:** Ahora tu servidor local tiene control de tu WhatsApp.

---

## ⚡ FASE 2: Configuración de n8n (El Flujo)

Ahora configuraremos el "cerebro".

1. Abre n8n en: `http://localhost:5678`.
2. Sigue el setup inicial (crear usuario/contraseña local).
3. **Importar el Flujo:**
   En lugar de crear nodos uno por uno, copia este JSON (te lo daré en el siguiente bloque para que solo lo pegues) o sigue estos pasos lógicos:

   **Nodos del Flujo:**
   1. **Webhook Node:** Escucha peticiones POST en `/webhook/whatsapp-message`.
   2. **Switch/Filter:** 
      * ¿Es una imagen? (`hasMedia == true`)
      * ¿Viene del grupo correcto? (`chatId == "xxxx@g.us"`)
   3. **HTTP Request (Descargar Imagen):** Pide la imagen a WAHA (`GET http://waha:3000/api/files/{id}`).
   4. **HTTP Request (Enviar a Python):**
      * URL: `http://host.docker.internal:8000/api/v1/scanner/`
      * Method: `POST`
      * Body: Multipart-Form-Data (File = Binary Data).
   5. **Respuesta Python:** Recibes `{ "amount": 50, "bank": "Banesco" ... }`.
   6. **HTTP Request (Responder WhatsApp):**
      * Manda un mensaje al grupo: "✅ Detectado: Banesco - 50.00 USD".

---

## 🔧 FASE 3: Conectar WAHA con n8n

Para que WAHA le avise a n8n cuando llega un mensaje:

1. Ve al Dashboard de WAHA (`http://localhost:3000`).
2. Busca la configuración de **Webhooks**.
3. URL del Webhook: `http://n8n:5678/webhook/whatsapp-message`
4. Eventos a escuchar: `message.any` o `message` (depende de la versión).

---

## 🧪 Pruebas

1. Asegúrate que tu Backend Python esté corriendo (`uvicorn app.main:app --reload`).
2. Envía una foto de un comprobante al grupo de WhatsApp.
3. Observa en n8n cómo se ilumina el flujo.
4. El backend Python procesará la imagen y n8n enviará la respuesta.

---

## ⚠️ Notas Importantes para Windows

* **Redes:** Desde dentro de Docker (n8n), tu máquina local NO es `localhost`, es `host.docker.internal`. Por eso verás esa dirección en las configuraciones.
* **Backup:** Exporta tu flujo de n8n regularmente.
