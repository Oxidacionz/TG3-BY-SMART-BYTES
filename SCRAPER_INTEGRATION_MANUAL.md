
# Manual de Integración Segura (Modo "Dual")

Este método asegura que tu scraper siga funcionando para tu app antigua **sin interrupciones**, mientras envía una copia de los datos a Smart Bytes.

## 1. Preparación en Railway

1.  Ve a tu proyecto Scraper en Railway.
2.  Agrega las variables de entorno (Settings -> Variables):
    - `SUPABASE_URL`: `https://kkkwfimgkemxwgvqvaob.supabase.co`
    - `SUPABASE_SERVICE_KEY`: `(Tu clave service_role que empieza por eyJ...)`
3.  Agrega `supabase` a tu `requirements.txt`.

## 2. Crear el "Puente" (Nuevo Archivo)

En tu proyecto scraper, crea un archivo nuevo llamado `puente_smartbytes.py` y pega este código. Esto aísla la lógica nueva para no tocar tus scripts viejos.

```python
import os
from datetime import datetime
from supabase import create_client

def sincronizar_con_smartbytes(precio_compra, precio_venta):
    """
    Envía los precios a Smart Bytes de forma silenciosa.
    Si falla, NO rompe el flujo principal del scraper.
    """
    print("--- Iniciando sincronización con Smart Bytes ---")
    
    url = os.environ.get("SUPABASE_URL_TORO")
    key = os.environ.get("SUPABASE_SERVICE_KEY_TORO")

    if not url or not key:
        print("⚠️ [SmartBytes] Saltando sincronización: Faltan credenciales _TORO.")
        return

    try:
        # Conexión
        sb = create_client(url, key)
        now = datetime.utcnow().isoformat()
        
        datos = []
        
        # Validación básica y preparación
        if precio_compra and float(precio_compra) > 0:
            datos.append({
                "from_currency": "USDT", "to_currency": "VES",
                "rate": float(precio_compra), "is_buy_rate": True, "captured_at": now
            })
            
        if precio_venta and float(precio_venta) > 0:
            datos.append({
                "from_currency": "USDT", "to_currency": "VES",
                "rate": float(precio_venta), "is_buy_rate": False, "captured_at": now
            })

        # Envío
        if datos:
            sb.table("exchange_rates").insert(datos).execute()
            print(f"✅ [SmartBytes] Datos enviados correctamente ({len(datos)} registros).")
        else:
            print("⚠️ [SmartBytes] No hubo datos válidos para enviar.")

    except Exception as e:
        # Capturamos CUALQUIER error para que tu app vieja no se detenga
        print(f"❌ [SmartBytes] Error no crítico: {e}")
    
    print("----------------------------------------------")
```

## 3. Conectar el Puente (Única modificación)

Ve a tu archivo principal (ej. `main.py` o `scraper.py`), busca donde obtienes los precios, e importa el puente.

```python
# --- Al inicio del archivo ---
from puente_smartbytes import sincronizar_con_smartbytes

# ... (Todo tu código existente de scraping) ...
# precios = obtener_precios_binance() 
# guardar_en_mi_base_vieja(precios)  <-- ESTO SE QUEDA IGUAL

# --- AL FINAL, agrega solo esto ---
# Suponiendo que tienes los precios en variables, pásalos a la función:

sincronizar_con_smartbytes(
    precio_compra=mi_variable_precio_compra, 
    precio_venta=mi_variable_precio_venta
)

print("Ciclo terminado.")
```

¡Listo! Con esto tu scraper servirá a dos señores sin conflicto.
