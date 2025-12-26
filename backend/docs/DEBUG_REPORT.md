# Reporte de Debugging: Banco de Venezuela

## 1. Análisis de Logs

Se analizaron los logs generados durante la prueba de un comprobante de "Pago Móvil BDV".

### Flujo Observado
1.  **Clasificación**: Correcta (`Bank.VENEZUELA`, `MOBILE_PAYMENT`).
2.  **Estrategia**: Correcta (`BancoVenezuelaStrategy`).
3.  **Pase 1 (Standard)**:
    *   **Tiempo**: 3.45s
    *   **Resultado**: Fallido ("incomplete results").
4.  **Pase 2 (Aggressive)**:
    *   **Tiempo**: 5.72s
    *   **Resultado**: Exitoso (200 OK).

### Evidencia del Fallo en Pase 1
El texto crudo extraído por Tesseract en el Pase 1 fue:
```text
PagomóvilBDV Personas
60,00 Bs
004395968524, [(]
04121300582
01054 8ANCO MERCANTIL
[pago
```

**El campo faltante es la FECHA.**
*   Se detectó el Monto (`60,00 Bs`).
*   Se detectó la Referencia (`004395968524`).
*   **No hay rastro de la fecha** (ej. `05/12/2025`) en el texto crudo.

## 2. Causa Raíz

El **Pase 1 (Standard)** está fallando porque Tesseract **no "ve" la fecha** en la imagen con el pre-procesamiento estándar.
*   Al no existir el texto de la fecha, ninguna Regex en `BancoVenezuelaStrategy` puede extraerla.
*   Esto activa la condición de "datos incompletos" en `StandardReceiptProcessor`, forzando el **Pase 2 (Aggressive)**.
*   El Pase 2 aplica filtros más agresivos (probablemente umbralización/contraste) que hacen visible la fecha, permitiendo que el proceso termine con éxito.

## 3. Conclusión

El problema **no es de lógica de extracción (Regex)** ni de clasificación. Es un problema de **calidad de imagen / pre-procesamiento** específico para este tipo de comprobantes en el modo "Standard".

## 4. Resolución (Implementada)

Se realizaron optimizaciones integrales para garantizar la extracción correcta y precisa en el **Pase 1**, priorizando la calidad de imagen sobre parches de regex.

### A. Optimización de Imagen (`ImageService`)
Se realizó un **barrido de parámetros** sistemático (ver `docs/OCR_PARAMETER_ANALYSIS.md`) y se encontró la configuración óptima:
*   **Block Size**: 49
*   **C**: 2

Esta configuración permite que Tesseract extraiga el texto limpio, incluyendo asteriscos (`****`) y caracteres especiales (`Bs`), eliminando la necesidad de hacks.

### B. Optimización de Regex (`Strategies`)
Gracias a la mejora en la imagen, se pudieron **limpiar y optimizar** las expresiones regulares:

1.  **Banco de Venezuela (`BancoVenezuelaStrategy`)**:
    *   Se implementaron separadores robustos (`BaseStrategy.SEP`) en lugar de `[:\s]+` para tolerar variaciones de espaciado y ruido.
    *   Se eliminaron parches específicos (como `4444` -> `****`) ya que el OCR ahora lee correctamente los asteriscos.

2.  **Base (`BaseStrategy`)**:
    *   Se eliminaron hacks de moneda (`8s`) ya que el OCR ahora lee correctamente `Bs`.

### Resultado Final
Con estos cambios, el sistema extrae **todos los campos requeridos** con precisión exacta en el **Pase 1**, utilizando un código más limpio y mantenible.
