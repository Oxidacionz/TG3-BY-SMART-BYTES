
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
RAILWAY_RATES_ID = int(os.getenv("RAILWAY_RATES_ID", 1))

_supabase_client = None

def get_supabase_client() -> Client | None:
    """
    Get or create a Supabase client singleton
    """
    global _supabase_client
    if _supabase_client:
        return _supabase_client
    
    if SUPABASE_URL and SUPABASE_KEY:
        try:
            _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
            return _supabase_client
        except Exception as e:
            print(f"❌ Error creating Supabase client: {e}")
            return None
    
    print("⚠️ Supabase credentials not found in environment variables")
    return None

def is_supabase_enabled() -> bool:
    """
    Check if Supabase is configured
    """
    return bool(SUPABASE_URL and SUPABASE_KEY)
