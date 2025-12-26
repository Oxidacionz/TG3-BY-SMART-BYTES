import sys
import os
import traceback
from fastapi.testclient import TestClient

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

print("--- DIAGNOSTICS START ---")

try:
    print("1. Attempting to import app.main...")
    from app.main import app
    print("   app.main imported successfully.")
except Exception:
    print("!!! FAILED to import app.main !!!")
    traceback.print_exc()
    sys.exit(1)

client = TestClient(app)

print("\n2. Testing /health endpoint...")
try:
    response = client.get("/api/v1/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception:
    print("!!! FAILED to hit /health !!!")
    traceback.print_exc()

print("\n3. Testing /api/v1/stats endpoint (triggers DB/Repo)...")
try:
    response = client.get("/api/v1/stats/")
    print(f"   Status: {response.status_code}")
    if response.status_code != 200:
        print(f"   Error: {response.text}")
    else:
        print("   Success.")
except Exception:
    print("!!! FAILED to hit /api/v1/stats/ !!!")
    traceback.print_exc()

print("\n4. Testing /api/v1/scanner/ health...")
try:
    response = client.get("/api/v1/scanner/health")
    print(f"   Status: {response.status_code}")
    if response.status_code != 200:
        print(f"   Error: {response.text}")
    else:
        print("   Success.")
except Exception:
    print("!!! FAILED to hit /api/v1/scanner/health !!!")
    traceback.print_exc()

print("--- DIAGNOSTICS END ---")
