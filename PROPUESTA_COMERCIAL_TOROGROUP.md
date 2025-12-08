# 📄 Propuesta de Desarrollo Tecnológico y Modernización

**Preparado por:** Smart Bytes  
**Para:** ToroGroup  
**Fecha:** 8 de Diciembre, 2025  
**Version:** 1.0  

---

## 1. Resumen Ejecutivo

Smart Bytes ha realizado una auditoría técnica profunda y un análisis funcional de la infraestructura actual de **ToroGroup**. El objetivo es transformar las herramientas actuales en una **Plataforma Integral de Gestión Financiera (FinTech)**.

La plataforma no solo registrará movimientos, sino que actuará como un **núcleo operativo inteligente**, capaz de monitorear tasas de cambio en tiempo real (Binance/BCV), alertar sobre oportunidades de arbitraje y automatizar la comunicación con clientes vía WhatsApp, todo bajo un entorno de seguridad de alto nivel basado en la nube.

---

## 2. Análisis Técnico: Alcance del Sistema (The "App")

La aplicación se ha estructurado en tres pilares fundamentales que justifican el desarrollo y la inversión:

### A. Core Financiero y Seguridad (Backend & Database)
*   **Base de Datos Relacional (Supabase/PostgreSQL):** Migración de hojas de cálculo a una base de datos real, permitiendo integridad de datos, copias de seguridad automáticas y escalabilidad a millones de registros.
*   **Autenticación Robusta:** Sistema de Login seguro para administradores y operadores, protegiendo la información sensible de la empresa.
*   **Gestión de Entidades:** Módulos completos para la administración de `Clientes`, `Operadores` y `Transacciones` con validación de datos estricta para evitar errores humanos.

### B. Inteligencia de Mercado (Scraping & Real-Time)
*   **Motor de Scraping (Railway):** Un servidor dedicado exclusivamente a monitorear 24/7 las tasas de cambio del BCV y Binance P2P.
*   **Cálculo Automático:** La aplicación calcula spreads y beneficios en tiempo real, eliminando el cálculo manual y reduciendo el tiempo de respuesta ante fluctuaciones del mercado.
*   **Integración API:** Conexión directa con fuentes de datos externas para mantener la plataforma siempre actualizada.

### C. Automatización y Notificaciones (n8n + WhatsApp AI)
*   **Infraestructura de Automatización (Docker/n8n):** Implementación de flujos de trabajo inteligentes.
*   **Bot de WhatsApp (WAHA):** Sistema capaz de enviar comprobantes, alertas de tasas y notificaciones de seguridad directamente al WhatsApp de los administradores o clientes, sin intervención humana.

---

## 3. Hoja de Ruta del Desarrollo (Roadmap - 15 Semanas)

Para garantizar un entregable mínimo viable (MVP) robusto y profesional, el desarrollo se divide en fases estratégicas.

#### **Fase 1: Cimientos y Seguridad (Semanas 1-4)**
*   Refinamiento final del esquema de Base de Datos.
*   Implementación total de políticas de seguridad (Row Level Security).
*   Despliegue de la interfaz de usuario con tema "Premium Metallic" (UI/UX).
*   **Entregable:** Acceso seguro y gestión de clientes/operadores funcional.

#### **Fase 2: Motor Transaccional y Lógica de Negocio (Semanas 5-9)**
*   Desarrollo de formularios de carga de transacciones con validación avanzada.
*   Integración final del Scraping de tasas en la vista de creación de órdenes.
*   Módulo de "Historial y Auditoría" (Logs de quién hizo qué y cuándo).
*   **Entregable:** Sistema capaz de procesar operaciones financieras completas sin errores.

#### **Fase 3: Automatización y Reportería (Semanas 10-13)**
*   Configuración de alertas automáticas vía WhatsApp (n8n).
*   Generación de reportes PDF/Excel para cierres contables.
*   Dashboard Gráfico: Visualización de ganancias, volumen y tendencias.
*   **Entregable:** El sistema "trabaja solo" enviando notificaciones y reportes.

#### **Fase 4: Pruebas, Despliegue y Capacitación (Semanas 14-15)**
*   Pruebas de estrés y seguridad.
*   Migración a servidor de producción definitivo.
*   Capacitación al equipo de ToroGroup sobre el uso de la herramienta.

---

## 4. Propuesta Económica

Entendiendo la visión de crecimiento de ToroGroup, Smart Bytes presenta dos modalidades de contratación para llevar a cabo este desarrollo de 15 semanas.

### Opción A: Desarrollo por Proyecto (Turnkey Solution)
Se establece un precio fijo por el desarrollo completo del software según las especificaciones anteriores.

*   **Inversión Total:** $2,000 USD.
*   **Esquema de Pagos:** Dividido equitativamente durante las 15 semanas de desarrollo (~$133/semana) o por hitos entregables (25% inicio, 25% fase 2, 25% fase 3, 25% final).
*   **Ventaja:** Costo cerrado, sin sorpresas. ToroGroup es dueño del código al finalizar.

### Opción B: Alianza Tecnológica (Recomendada 🌟)
Smart Bytes se integra como el "Departamento Técnico" de ToroGroup. En lugar de cobrar el proyecto completo, establecemos una relación laboral mensual. Esto asegura no solo el desarrollo, sino el mantenimiento evolutivo, soporte ante caídas de Binance/BCV y mejoras constantes.

*   **Inicial (Setup Fee):** $300 USD (Configuración de servidores, licencias y arquitectura inicial).
*   **Retainer Mensual:** $250 USD / mes.
*   **Compromiso:** Contrato de servicios profesionales.
*   **Ventaja Estratégica:**
    *   Menor desembolso inicial para ToroGroup.
    *   Soporte continuo: Si Binance cambia su API mañana, nosotros lo arreglamos sin costo extra.
    *   Flexibilidad: Podemos agregar nuevas funciones mes a mes sin renegociar un contrato nuevo.

---

## 5. Requerimientos Operativos (Costos de Terceros)
Independientemente de la opción elegida, el sistema requiere infraestructura en la nube para operar 24/7. Estos costos son transparentes y se pagan directo a los proveedores:

1.  **Railway/VPS (Backend & Scraper):** Aprox. $5 - $10 USD/mes.
2.  **Supabase (Base de Datos):** Nivel gratuito (suficiente para iniciar) o Pro ($25/mes si escala mucho).
3.  **WhatsApp API (Número telefónico):** Requiere un chip/número dedicado para el Bot.

---

**Conclusión:**
La implementación de este sistema colocará a **ToroGroup** muy por delante de la competencia que sigue operando con Excel y procesos manuales. La automatización reduce errores, ahorra tiempo y profesionaliza la imagen ante los clientes.

Atentamente,

**Smart Bytes Development Team**
