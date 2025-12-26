import sys
import os

# Add backend to path
backend_path = os.path.join(os.getcwd(), 'backend')
sys.path.append(backend_path)
print(f"Added {backend_path} to sys.path")

try:
    print("Importing TransactionReceipt...")
    from app.schemas.receipt import TransactionReceipt
    print("Schema imported successfully")
except Exception as e:
    print(f"Schema import failed: {e}")
    sys.exit(1)

try:
    print("Importing SYSTEM_PROMPT...")
    from app.core.prompts import SYSTEM_PROMPT
    print("Prompts imported successfully")
except Exception as e:
    print(f"Prompts import failed: {e}")
    sys.exit(1)

try:
    print("Importing GeminiScanner...")
    from app.services.gemini_scanner import GeminiScanner
    print("GeminiScanner imported successfully")
except Exception as e:
    print(f"GeminiScanner import failed: {e}")
    sys.exit(1)
