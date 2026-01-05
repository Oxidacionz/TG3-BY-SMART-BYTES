import sys
import os
import io
from fastapi.testclient import TestClient

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.main import app

client = TestClient(app)

print("--- DEBUG POST /SCANNER ---")

# Create a small dummy image
dummy_image_content = b"fakeimagecontent"
files = {'file': ('test.jpg', dummy_image_content, 'image/jpeg')}

try:
    print("Sending POST request to /api/v1/scanner/ ...")
    response = client.post("/api/v1/scanner/", files=files)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 500:
        print("\n!!! 500 ERROR CAUGHT !!!")
        # In TestClient, exceptions in the app are usually reraised unless handled. 
        # If we see 500 here, it means the app handled it or the client is swallowing it.
        # But usually console output will show the traceback from the app side.
except Exception as e:
    print(f"EXCEPTION: {e}")
    import traceback
    traceback.print_exc()
