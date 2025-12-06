
from fastapi import APIRouter, HTTPException
from app.services.bcv_scraper import scrape_bcv_rates
from app.services.binance_scraper import obtener_precios_p2p, calcular_promedio
from app.core import database_sb
import asyncio

router = APIRouter()

@router.post("/force-refresh", summary="Force Exchange Rates Update")
async def force_refresh_rates():
    """
    Triggers an immediate scrape of BCV and Binance rates and updates the database.
    Returns the newly updated rates.
    """
    try:
        print("🔄 Force Refresh: Starting scrape job...")
        
        # 1. Scrape BCV (Run in executor to avoid blocking)
        loop = asyncio.get_event_loop()
        bcv_result = await loop.run_in_executor(None, scrape_bcv_rates)
        
        usd_bcv = bcv_result.get("USD") if bcv_result else 0.0
        eur_bcv = bcv_result.get("EUR") if bcv_result else 0.0
        
        # 2. Scrape Binance (Run in executor)
        # Note: 'obtener_precios_p2p' is synchronous blocking code
        precios_buy = await loop.run_in_executor(None, obtener_precios_p2p, "BUY")
        precios_sell = await loop.run_in_executor(None, obtener_precios_p2p, "SELL")
        
        avg_buy = calcular_promedio(precios_buy)
        avg_sell = calcular_promedio(precios_sell)
        
        print(f"📊 Scrape Results: BCV_USD={usd_bcv}, BCV_EUR={eur_bcv}, BinBuy={avg_buy}, BinSell={avg_sell}")
        
        # 3. Save to Database (Supabase + Local Fallback)
        if usd_bcv or avg_buy > 0:
             await loop.run_in_executor(None, database_sb.save_rates, usd_bcv, eur_bcv, avg_buy, avg_sell)
        
        # 4. Return latest rates
        latest = await loop.run_in_executor(None, database_sb.get_latest_rates)
        
        if not latest:
            return {"status": "error", "message": "Failed to retrieve updated rates"}
            
        return {
            "success": True,
            "data": latest,
            "source": "scraped_now"
        }
        
    except Exception as e:
        print(f"❌ Force Refresh Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/", summary="Get Latest Rates")
async def get_rates():
    """
    Get the latest available rates from the database.
    """
    loop = asyncio.get_event_loop()
    rates = await loop.run_in_executor(None, database_sb.get_latest_rates)
    if not rates:
         # Fallback default structure
         return {
            "usd_bcv": 0,
            "eur_bcv": 0,
            "usd_binance_buy": 0,
            "usd_binance_sell": 0,
            "last_updated": None
         }
    return rates
