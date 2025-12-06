import asyncio
import sys
import os

# Add the current directory to sys.path so we can import app modules
sys.path.append(os.getcwd())

from app.core.database_sb import get_rates_from_supabase

async def check():
    print("Checking rates from Supabase...")
    try:
        rates = await get_rates_from_supabase()
        print("\n--- Latest Rates in Supabase ---")
        print(rates)
        print("--------------------------------\n")
        
        if rates.get("usd_bcv") or rates.get("usd_binance_buy"):
            print("✅ Data found!")
        else:
            print("⚠️ No rates found yet. fluctuating?")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(check())
