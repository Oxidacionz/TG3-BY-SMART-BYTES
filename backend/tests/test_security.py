from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_key_missing():
    # Try to access without header
    files = {'file': ('test.jpg', b'fake', 'image/jpeg')}
    response = client.post("/api/v1/process-ocr", files=files)
    assert response.status_code == 403
    assert response.json()["detail"] == "Could not validate credentials"

def test_api_key_invalid():
    # Try to access with wrong header
    files = {'file': ('test.jpg', b'fake', 'image/jpeg')}
    headers = {"X-API-Key": "wrong-key"}
    response = client.post("/api/v1/process-ocr", files=files, headers=headers)
    assert response.status_code == 403
