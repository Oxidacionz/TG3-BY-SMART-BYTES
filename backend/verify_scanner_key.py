
import sys
import os
from pathlib import Path

# Add backend directory to sys.path to allow imports
sys.path.append(str(Path(__file__).parent))

try:
    from app.core.config import settings
    from app.services.ai_scanner import SmartScannerService
    
    print(f"Checking GEMINI_API_KEY configuration...")
    if settings.GEMINI_KEYS:
        print(f"SUCCESS: Loaded {len(settings.GEMINI_KEYS)} keys from configuration.")
        for i, k in enumerate(settings.GEMINI_KEYS):
             masked = k[:4] + "..." + k[-4:]
             print(f"  Key {i+1}: {masked}")

        service = SmartScannerService()
        if service.model:
            print("SUCCESS: SmartScannerService initialized with Gemini model.")
        else:
            print("FAILURE: SmartScannerService failed to initialize model.")
    else:
        print("FAILURE: No keys found in settings.GEMINI_KEYS")

except Exception as e:
    print(f"ERROR: {e}")
