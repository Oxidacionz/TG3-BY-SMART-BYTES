import sys
import os
import traceback

# Add backend to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

print("Attempting to import app.main...")
try:
    from app.main import app
    print("SUCCESS: app.main imported.")
except Exception:
    print("CRITICAL FAILURE IMPORTING APP:")
    traceback.print_exc()
