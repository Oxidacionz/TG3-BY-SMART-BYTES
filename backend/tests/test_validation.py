from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from unittest.mock import patch

client = TestClient(app)

def test_upload_valid_image():
    # Create a small valid image (1x1 pixel black)
    # JPEG magic number: FF D8 FF
    content = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xda\x00\x08\x01\x01\x00\x00\x00?\x00\xbf\x00'
    files = {'file': ('test.jpg', content, 'image/jpeg')}
    headers = {"X-API-Key": "dev-secret-key"}
    response = client.post("/api/v1/process-ocr", files=files, headers=headers)
    
    # We expect 200 OK, even if OCR fails to find text, the validation should pass
    # If OCR fails completely it returns 200 with ok: False, error: ...
    assert response.status_code == 200
    # The error might be "OCR processing failed" or "Missing required fields" but NOT "File too large" or "Invalid image"
    json_resp = response.json()
    if not json_resp["ok"]:
        assert "File too large" not in json_resp["error"]
        assert "Invalid image" not in json_resp["error"]

def test_upload_too_large_file():
    # Use patch to safely override the setting only for this test
    with patch.object(settings, 'MAX_FILE_SIZE_MB', 1):
        large_content = b"0" * (1024 * 1024 + 100) # 1MB + 100 bytes
        files = {'file': ('large.jpg', large_content, 'image/jpeg')}
        headers = {"X-API-Key": "dev-secret-key"}
        response = client.post("/api/v1/process-ocr", files=files, headers=headers)
        
        assert response.status_code == 200
        assert response.json()["ok"] is False
        assert "File too large" in response.json()["error"]

def test_upload_invalid_file_type():
    # Upload a text file
    content = b"This is not an image"
    files = {'file': ('test.txt', content, 'text/plain')}
    headers = {"X-API-Key": "dev-secret-key"}
    response = client.post("/api/v1/process-ocr", files=files, headers=headers)
    
    assert response.status_code == 200
    assert response.json()["ok"] is False
    assert "Invalid image" in response.json()["error"]
