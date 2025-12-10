# 📋 Pasos Pendientes: Automatización WhatsApp

Fecha: 9 de Diciembre 2025
Estado: **Infraestructura lista (Docker + n8n + WAHA Persistente). Falta vincular y probar.**

---

## 🚀 Paso 1: Escanear QR (Reconexión Final)
Como configuramos la persistencia de datos (para no perder la sesión nunca más), se requiere un último escaneo.

1.  Asegúrate que Docker esté corriendo.
2.  Ve a: **[http://localhost:3000/dashboard](http://localhost:3000/dashboard)**
3.  Credenciales (si pide): `admin` / `admin`
4.  Si da error de conexión, clic en el ✏️ y pon API Key: `123`.
5.  **Escanea el QR** con el celular que hará de "Bot".
    *   *Debe quedar en estado: `AUTHENTICATED`*.

---

## 🧪 Paso 2: Prueba de los 2 Grupos (Ida y Vuelta)

El flujo `n8n_workflow_final.json` ya está diseñado para manejar dos vías.

### A. Prueba de Salida (Alertas) 📤
Probaremos que n8n pueda enviar mensajes a un grupo de "Alertas Admin".

1.  En n8n (`http://localhost:5678`), abre el nodo **"Enviar Alerta WhatsApp"**.
2.  Cambia el `chatId` por el ID del grupo (o tu número personal para probar).
    *   *Tip: Para sacar el ID de un grupo, escribe un mensaje en el grupo y mira los logs de WAHA, o usa tu número personal `123456... @c.us`*.
3.  Ejecuta el nodo manuamente ("Execute Node").
4.  Verifica que llegue el mensaje: *"🔔 Nueva Transacción..."*.

### B. Prueba de Entrada (Recepción de Comprobantes) 📥
Probaremos que n8n escuche cuando alguien manda una foto.

1.  Asegúrate que el flujo en n8n esté **Activo** (Switch verde arriba a la derecha).
2.  Desde otro WhatsApp (el de un "cliente" ficticio), envía una **FOTO** al número del Bot.
3.  El Bot debería responder automáticamente: *"🤖 He recibido tu comprobante..."*.
4.  (Opcional) Revisa en n8n la pestaña "Executions" para ver cómo procesó la imagen.

---

## 🛠️ Siguientes Mejoras (To-Do Futuro)
Una vez confirmado lo anterior:
1.  Conectar el nodo de "Entrada" con **Supabase** para guardar la foto real.
2.  Conectar el Webhook de "Salida" con el código de la App React (backend).
