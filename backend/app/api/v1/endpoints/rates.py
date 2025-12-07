
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
        print("🔄 Force Refresh: Request received.")
        print("⚠️  Internal Scraping DISABLED. Rates are now managed by external microservice.")
        
        # --- MIGRACIÓN: Scraper interno desactivado ---
        # 1. Scrape BCV (Disabled)
        # bcv_result = await loop.run_in_executor(None, scrape_bcv_rates)
        # ...
        
        # 2. Scrape Binance (Disabled)
        # ...
        
        # 3. Save to Database (Disabled)
        # await loop.run_in_executor(None, database_sb.save_rates, ...)
        
        # 4. Return latest rates (Read from shared Global ID)
        loop = asyncio.get_event_loop()
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
