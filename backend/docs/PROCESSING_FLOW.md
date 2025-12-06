# Flujo de Procesamiento de PagoVision API

Este documento detalla las fases por las que pasa cada imagen recibida por el endpoint `/api/v1/process-ocr`.

## Resumen del Flujo

1.  **Validación Inicial**: Verificación de formato y tamaño.
2.  **Pipeline OCR (2 Pasos)**: Extracción de texto con estrategia de "Smart Retry".
    *   *Pase 1 (Standard)*: Pre-procesamiento balanceado.
    *   *Pase 2 (Aggressive)*: Solo si el Pase 1 falla, con filtros de alto contraste.
3.  **Parsing Inteligente**: Clasificación, extracción por estrategia y fallbacks.
4.  **Inferencia**: Deducción de datos bancarios faltantes.
5.  **Validación Final**: Verificación de campos obligatorios.

---

## Detalle por Fases

### 1. Validación Inicial
Antes de procesar la imagen, se realizan validaciones de seguridad y formato:
*   **Tamaño**: Se verifica que el archivo no exceda el límite configurado (ej. 5MB).
*   **Formato (Magic Numbers)**: Se inspeccionan los primeros bytes para asegurar que es una imagen válida (JPEG, PNG, WEBP), independientemente de la extensión del archivo.

### 2. Pipeline OCR (Extracción de Texto)
El núcleo del procesamiento utiliza un enfoque de dos fases para balancear velocidad y precisión.

#### Fase 2.1: Pase 1 (Standard)
*   **Pre-procesamiento**: Se ajusta la imagen (escala de grises, redimensionamiento, umbralización adaptativa suave) para maximizar la claridad del texto en comprobantes limpios.
*   **Motor OCR**: Tesseract extrae el texto crudo.
*   **Parsing (ver Fase 3)**: Se intenta estructurar los datos.
*   **Control de Calidad**: Se verifica si se encontraron campos críticos (`Monto` y `Fecha`).
    *   *Si se encuentran*: El proceso termina aquí (éxito rápido).
    *   *Si faltan*: Se activa el Pase 2.

#### Fase 2.2: Pase 2 (Aggressive) - *Condicional*
Solo se ejecuta si el Pase 1 falla.
*   **Pre-procesamiento Agresivo**: Se aplican filtros más fuertes (mayor contraste, dilatación/erosión) para rescatar texto en imágenes con ruido, baja luz o marcas de agua.
*   **Extracción y Parsing**: Se repite el proceso de OCR y parsing.
*   **Smart Merge**: Se combinan los resultados del Pase 1 y Pase 2.
    *   *Ejemplo*: Si el Pase 1 obtuvo el `Monto` pero no la `Fecha`, y el Pase 2 obtuvo la `Fecha` pero leyó mal el `Monto`, el resultado final tendrá ambos campos correctos.

### 3. Parsing Inteligente
Esta etapa convierte el texto crudo en datos estructurados JSON. Ocurre dentro de cada pase de OCR.

1.  **Clasificación**: Se analiza el texto para identificar el Banco (ej. "Banco de Venezuela") y el Tipo de Transacción (ej. "Pago Móvil").
2.  **Selección de Estrategia**: Se instancia una clase específica para ese banco (ej. `BancoVenezuelaStrategy`) que contiene expresiones regulares optimizadas para ese formato.
3.  **Extracción Principal**: La estrategia extrae los campos clave.
4.  **Fallbacks (Red de Seguridad)**: Si la estrategia específica falla en algún campo, se ejecuta una cadena de extractores genéricos (`FallbackManager`) que buscan patrones universales (ej. fechas `DD/MM/AAAA`, montos con `Bs`, etc.).

### 4. Inferencia de Datos
Una vez extraídos los datos, se intenta completar información faltante usando catálogos internos:
*   **Inferencia de Banco**: Si falta el `bankCode` o `bankName`, se intenta deducir uno a partir del otro usando un catálogo oficial de bancos venezolanos (ej. `0102` -> `BANCO DE VENEZUELA`).

### 5. Validación Final
Se verifica que el objeto resultante contenga todos los campos obligatorios para considerar la transacción válida:
*   `amount_value` (Monto numérico)
*   `date` (Fecha)
*   `operation` (Número de referencia)
*   `identification` (Cédula/RIF)
*   `destination` (Teléfono/Cuenta destino)
*   `bankName` (Nombre del banco)

Si falta alguno de estos campos tras todas las fases, se retorna un error indicando qué datos faltan.
