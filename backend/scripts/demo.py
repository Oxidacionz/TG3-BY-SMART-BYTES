import sys
import os
import argparse
import json
from fastapi.testclient import TestClient
from app.main import app

# Add project root to path
sys.path.append(os.getcwd())

client = TestClient(app)

def run_demo():
    parser = argparse.ArgumentParser(description="Test OCR API with a local image.")
    parser.add_argument("image_path", nargs="?", default="tests/fixtures/comprobante.jpeg", help="Path to the image file")
    args = parser.parse_args()

    image_path = args.image_path
    if not os.path.exists(image_path):
        print(f"Error: {image_path} not found.")
        return

    print(f"Processing {image_path}...")
    try:
        with open(image_path, "rb") as f:
            files = {'file': (os.path.basename(image_path), f, 'image/jpeg')}
            headers = {"X-API-Key": "dev-secret-key"}
            response = client.post("/api/v1/process-ocr", files=files, headers=headers)

        if response.status_code == 200:
            print("Success!")
            print(json.dumps(response.json(), indent=2, ensure_ascii=False))
        else:
            print(f"Failed with status {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    run_demo()
