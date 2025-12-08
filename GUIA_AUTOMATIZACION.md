# 🤖 Guía de Automatización: n8n + WhatsApp (Docker)

Esta guía te ayudará a configurar tu sistema de notificaciones automáticas paso a paso.

## 📋 Prerrequisitos
- **Docker Desktop** instalado y corriendo (debe verse el icono de la ballena en tu barra de tareas).

---

## 🚀 Paso 1: Encender los Motores (Docker)

Docker nos permite correr servidores complejos (como n8n y WhatsApp API) sin instalar nada más que Docker.

1.  Abre tu terminal (VS Code o CMD/PowerShell).
2.  Navega a la carpeta de infraestructura:
    ```bash
    cd infra
    ```
3.  Ejecuta el comando de arranque:
    ```bash
    docker-compose -f docker-compose-n8n.yml up -d
    ```
    *(La primera vez tardará unos minutos descargando las imágenes).*

4.  Verifica que estén corriendo:
    ```bash
    docker ps
    ```
    *Deberías ver dos líneas: `n8n-automation` y `waha-whatsapp`.*

---

## 📱 Paso 2: Conectar tu WhatsApp

Vamos a vincular tu WhatsApp para que el sistema pueda enviar mensajes por ti.

1.  Abre tu navegador y ve a:
    👉 **[http://localhost:3000/dashboard](http://localhost:3000/dashboard)**
    *(Si te pide login, revisa si hay credenciales por defecto, usualmente no en modo dev).*

2.  Busca la sección de **Scan QR** o espera unos segundos a que cargue.
3.  **Abre WhatsApp en tu celular** -> Dispositivos Vinculados -> Vincular dispositivo.
4.  Escanea el código QR que aparece en pantalla.
5.  Una vez escaneado, verás que el estado cambia a `AUTHENTICATED` o `READY`.

---

## 🧠 Paso 3: Configurar el Cerebro (n8n)

Ahora configuraremos n8n para recibir alertas de ToroGroup y enviarlas a WhatsApp.

1.  Abre otra pestaña y ve a:
    👉 **[http://localhost:5678](http://localhost:5678)**

2.  Te pedirá crear una cuenta de administrador local (es solo para ti). Llénalo y entra.

3.  **Importar el Flujo Automático**:
    - Busca el menú **"Workflows"**.
    - Haz clic en **"Add Workflow"** o el botón **+**.
    - Busca el menú de tres puntos (arriba a la derecha) o "Import from File".
    - Selecciona el archivo que creé para ti en:
      `ToroGroup/TG2/infra/n8n_workflow_whatsapp.json`

4.  **Verás 2 Nodos**:
    - **Webhook Transacción**: Es la "oreja" que escucha a la App.
    - **Enviar WhatsApp (WAHA)**: Es la "boca" que habla por WhatsApp.

5.  **Activar**:
    - Haz clic en **"Activate"** (switch arriba a la derecha) para ponerlo en vivo.

---

## 🧪 Paso 4: Probar

1.  En n8n, haz clic en el nodo "Webhook Transacción" y dale a **"Execute Node"** (para escuchar una prueba).
2.  Desde una terminal diferente, simula una alerta (o usa la App si ya implementamos el botón):
    ```bash
    curl -X POST http://localhost:5678/webhook/transaction-alert -H "Content-Type: application/json" -d "{\"data\": {\"amount\": \"100\", \"currency\": \"USD\"}}"
    ```
3.  ¡Deberías recibir un WhatsApp!

---

## ⚠️ Nota Importante sobre el Número de Destino

En el nodo de n8n "Enviar WhatsApp", debes editar el campo `chatId` con tu número real.
El formato es: `codigopais` + `numero` + `@c.us`.
Ejemplo para Venezuela: `584121234567@c.us`
Ejemplo para USA: `15551234567@c.us`

Si no cambias esto, ¡el mensaje no llegará a nadie!
