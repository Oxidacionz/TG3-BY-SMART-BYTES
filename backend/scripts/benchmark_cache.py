import sys
import os
import time
from fastapi.testclient import TestClient
from app.main import app

# Add project root to path
sys.path.append(os.getcwd())

client = TestClient(app)

def benchmark():
    image_path = "tests/fixtures/comprobante.jpeg"
    if not os.path.exists(image_path):
        print(f"Error: {image_path} not found.")
        return

    print(f"Benchmarking with {image_path}...\n")

    # Read file content once
    with open(image_path, "rb") as f:
        file_content = f.read()

    # --- Request 1: Cache Miss (Processing) ---
    print("Request 1 (Cache Miss)...")
    start_time = time.perf_counter()
    
    files = {'file': ('comprobante.jpeg', file_content, 'image/jpeg')}
    response1 = client.post("/api/v1/process-ocr", files=files)
    
    end_time = time.perf_counter()
    duration1 = end_time - start_time
    
    if response1.status_code == 200:
        print(f"Time: {duration1:.4f} seconds")
    else:
        print(f"Failed: {response1.status_code}")
        return

    # --- Request 2: Cache Hit (Instant) ---
    print("\nRequest 2 (Cache Hit)...")
    start_time = time.perf_counter()
    
    files = {'file': ('comprobante.jpeg', file_content, 'image/jpeg')}
    response2 = client.post("/api/v1/process-ocr", files=files)
    
    end_time = time.perf_counter()
    duration2 = end_time - start_time
    
    if response2.status_code == 200:
        print(f"Time: {duration2:.4f} seconds")
    else:
        print(f"Failed: {response2.status_code}")
        return

    # --- Results ---
    print("\n--- Results ---")
    print(f"First Request (Processing): {duration1:.4f}s")
    print(f"Second Request (Cached):    {duration2:.4f}s")
    
    if duration2 > 0:
        speedup = duration1 / duration2
        print(f"Speedup: {speedup:.1f}x faster")
    else:
        print("Speedup: Infinite (instant response)")

if __name__ == "__main__":
    benchmark()
