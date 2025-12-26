import requests
import json

# URL de la API interna de Binance P2P
API_URL = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search"

def obtener_precios_p2p(trade_type: str) -> list[float]:
    """
    Realiza una petición a la API interna de Binance P2P para obtener los precios.
    :param trade_type: 'BUY' para anuncios de compra de USDT o 'SELL' para anuncios de venta de USDT.
    :return: Una lista de precios como números flotantes.
    """
    payload = {
        "asset": "USDT",
        "fiat": "VES",
        "tradeType": trade_type,
        "page": 1,
        "rows": 10,
        "filterType": "all",
        "countries": [],
        "payTypes": []
    }
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.post(API_URL, headers=headers, data=json.dumps(payload), timeout=10)
        response.raise_for_status()
        
        data = response.json()
        precios = []
        
        if data and 'data' in data:
            # Empezamos desde la SEGUNDA posición (índice 1) para evitar el anuncio patrocinado.
            # Tomamos hasta 5 anuncios.
            anuncios = data['data'][1:6] 
            
            for anuncio in anuncios:
                precio = float(anuncio['adv']['price'])
                precios.append(precio)
                
        return precios
    
    except requests.exceptions.RequestException as e:
        print(f"Error al realizar la petición API para {trade_type}: {e}")
        return []
    except (KeyError, TypeError, ValueError) as e:
        print(f"Error al parsear la respuesta JSON para {trade_type}: {e}")
        return []

def calcular_promedio(precios: list[float]) -> float:
    """Calcula el promedio de una lista de precios."""
    if not precios:
        return 0.0
    return sum(precios) / len(precios)

# ==========================================
# Integración con Smart Bytes (Supabase)
# ==========================================
import os
from datetime import datetime

def save_to_smart_bytes(usd_binance_buy: float, usd_binance_sell: float):
    """
    Guarda las tasas obtenidas en Supabase.
    """
    try:
        from supabase import create_client
    except ImportError:
        print("⚠️ Librería 'supabase' no instalada. Ejecuta: pip install supabase")
        return

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    
    # Credenciales hardcodeadas Opcionales (Solo para facilitar la migración si el usuario copia el archivo)
    # url = url or "https://kkkwfimgkemxwgvqvaob.supabase.co"
    # key = key or "..." 

    if not url or not key:
        print("❌ Faltan credenciales SUPABASE_URL / SUPABASE_SERVICE_KEY")
        return

    try:
        supabase = create_client(url, key)
        now = datetime.utcnow().isoformat()
        rates_to_insert = []

        if usd_binance_buy > 0:
            rates_to_insert.append({
                "from_currency": "USDT", "to_currency": "VES",
                "rate": usd_binance_buy, "is_buy_rate": True, "captured_at": now
            })
        
        if usd_binance_sell > 0:
            rates_to_insert.append({
                "from_currency": "USDT", "to_currency": "VES",
                "rate": usd_binance_sell, "is_buy_rate": False, "captured_at": now
            })

        if rates_to_insert:
            res = supabase.table("exchange_rates").insert(rates_to_insert).execute()
            if res.data:
                print(f"✅ Sincronizado con Smart Bytes: {len(res.data)} tasas enviadas.")
            else:
                print("⚠️ Error al insertar en Supabase (sin datos).")
    except Exception as e:
        print(f"❌ Error enviando a Supabase Principal: {e}")

    # ------------------------------------------------------------------
    #  Sincronización Secundaria (ToroGroup / TG2)
    # ------------------------------------------------------------------
    url_tg2 = os.environ.get("SUPABASE_URL_TORO")
    key_tg2 = os.environ.get("SUPABASE_SERVICE_KEY_TORO")

    if url_tg2 and key_tg2:
        try:
            print("🚀 Sincronizando también con ToroGroup (Secondary Database)...")
            supabase_tg2 = create_client(url_tg2, key_tg2)
            
            # Re-usamos rates_to_insert generado arriba
            if rates_to_insert:
                res_tg2 = supabase_tg2.table("exchange_rates").insert(rates_to_insert).execute()
                if res_tg2.data:
                    print(f"✅ Sincronizado con ToroGroup: {len(res_tg2.data)} tasas enviadas.")
                else:
                    print("⚠️ ToroGroup insert returned no data")
        except Exception as e_tg2:
             print(f"❌ Error enviando a ToroGroup: {e_tg2}")


def run_sync():
    """Ejecuta el scraping y la sincronización."""
    print("🔄 Iniciando scraping de Binance...")
    
    # Obtener Compra (Buy) y Venta (Sell)
    # Nota: En P2P, lo que para el usuario es "Comprar" (Buy) son anuncios de Venta de otros, y viceversa.
    # Pero para simplificar: 
    # tradeType="BUY" -> Anuncios donde yo puedo comprar USDT (El precio "Ask")
    # tradeType="SELL" -> Anuncios donde yo puedo vender USDT (El precio "Bid")
    
    precios_buy = obtener_precios_p2p("BUY")
    avg_buy = calcular_promedio(precios_buy)
    
    precios_sell = obtener_precios_p2p("SELL")
    avg_sell = calcular_promedio(precios_sell)
    
    print(f"📊 Tasas obtenidas - Buy: {avg_buy:.2f}, Sell: {avg_sell:.2f}")
    
    # Enviar a Smart Bytes
    save_to_smart_bytes(avg_buy, avg_sell)

if __name__ == "__main__":
    # Para probar localmente o ejecutar directametne
    run_sync()
