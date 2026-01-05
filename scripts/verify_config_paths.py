import sys
from pathlib import Path

# Add backend directory to sys.path
backend_path = Path("backend").absolute()
sys.path.append(str(backend_path))

try:
    from app.core.config import settings
    print(f"Checking keys config...")
    if settings.GEMINI_KEYS:
        print(f"SUCCESS: Loaded {len(settings.GEMINI_KEYS)} keys.")
        print(f"First key source: {settings.GEMINI_KEYS[0][:5]}...")
    else:
        print("FAIL: No keys loaded.")
except Exception as e:
    print(f"FAIL: Error loading settings: {e}")
