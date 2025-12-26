import sys
import os
from fastapi import FastAPI

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

print("1. Importing settings...")
try:
    from app.core.config import settings
    print("Settings loaded.")
except Exception as e:
    print(f"FAILED settings: {e}")

print("2. Importing main router...")
try:
    from app.api.v1.router import api_router
    print("Router loaded.")
except Exception as e:
    print(f"FAILED router: {e}")
    import traceback
    traceback.print_exc()

print("3. Validating receipt schema...")
try:
    from app.schemas.receipt import TransactionReceipt
    print("Schema loaded.")
except Exception as e:
    print(f"FAILED schema: {e}")
