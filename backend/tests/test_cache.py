import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.cache.storage import InMemoryCacheStorage
from app.services.image_service import ImageService
from app.services.ocr_service import TesseractService
from app.services.parser_service import ReceiptParser

client = TestClient(app)

# Minimal valid JPEG image (1x1 pixel, white)
VALID_JPEG = (
    b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\xff\xff\xff\xff\xff\xff\xff\xff'
    b'\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xdb\x00C\x01\xff\xff\xff\xff\xff\xff\xff\xff'
    b'\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xc0\x00\x11\x08\x00\x01\x00\x01\x03\x01\x22\x00\x02\x11\x01\x03\x11\x01\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xc4\x00\xb5\x10\x00\x02\x01\x03\x03\x02\x04\x03\x05\x05\x04\x04\x00\x00\x01}\x01\x02\x03\x00\x04\x11\x05\x12!1A\x06\x13Qa\x07"q\x142\x81\x91\xa1\x08#B\xb1\xc1\x15R\xd1\xf0$3br\x82\t\n\x16\x17\x18\x19\x1a%&\'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\x83\x84\x85\x86\x87\x88\x89\x8a\x92\x93\x94\x95\x96\x97\x98\x99\x9a\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xff\xc4\x00\x1f\x01\x00\x03\x01\x01\x01\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xc4\x00\xb5\x11\x00\x02\x01\x02\x04\x04\x03\x04\x07\x05\x04\x04\x00\x01\x02w\x00\x01\x02\x03\x11\x04\x05!1\x06\x12AQ\x07aq\x13"2\x81\x08\x14B\x91\xa1\xb1\xc1\t#3R\xf0\x15br\xd1\n\x16$4\xe1%\xf1\x17\x18\x19\x1a&\'()*56789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\x82\x83\x84\x85\x86\x87\x88\x89\x8a\x92\x93\x94\x95\x96\x97\x98\x99\x9a\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xff\xda\x00\x0c\x03\x01\x00\x02\x11\x03\x11\x00?\x00\xfd\xfc\xaf\xff\xd9'
)

@pytest.fixture
def mock_services():
    # Mock ImageService
    mock_image_service = MagicMock(spec=ImageService)
    mock_image_service.preprocess.return_value = MagicMock()

    # Mock TesseractService (OCREngine)
    mock_ocr_service = MagicMock(spec=TesseractService)
    mock_ocr_service.extract_text.return_value = "Monto: 100.00 Fecha: 2023-10-27"

    # Mock ReceiptParser
    mock_parser_service = MagicMock(spec=ReceiptParser)
    mock_parser_service.parse.return_value = MagicMock(
        amount_value=100.00,
        date="2023-10-27",
        operation="123456",
        identification="V12345678",
        origin="Banco A",
        destination="Banco B",
        bankCode="0102",
        bankName="Banco de Venezuela",
        model_dump=lambda: {
            "amount_value": 100.00,
            "date": "2023-10-27",
            "operation": "123456",
            "identification": "V12345678",
            "origin": "Banco A",
            "destination": "Banco B",
            "bankCode": "0102",
            "bankName": "Banco de Venezuela"
        }
    )

    # Override dependencies
    app.dependency_overrides[ImageService] = lambda: mock_image_service
    app.dependency_overrides[TesseractService] = lambda: mock_ocr_service
    app.dependency_overrides[ReceiptParser] = lambda: mock_parser_service
    
    # Return mocks as a dictionary for better readability
    yield {
        "image": mock_image_service,
        "ocr": mock_ocr_service,
        "parser": mock_parser_service
    }

    # Clean up overrides
    app.dependency_overrides = {}

def test_cache_hit(mock_services):
    mock_ocr_service = mock_services["ocr"]
    
    # Use patch to isolate cache setting
    with patch.object(settings, 'CACHE_ENABLED', True):
        # Re-initialize cache to pick up the setting (if needed by implementation)
        # Assuming InMemoryCacheStorage checks settings on init or usage
        InMemoryCacheStorage()._initialize()
        InMemoryCacheStorage().clear()
        
        # First request
        files = {"file": ("test.jpg", VALID_JPEG, "image/jpeg")}
        headers = {"X-API-Key": "dev-secret-key"}
        response1 = client.post("/api/v1/process-ocr", files=files, headers=headers)
        assert response1.status_code == 200, f"Response: {response1.json()}"
        assert response1.json()["ok"] is True, f"Response: {response1.json()}"
        
        # Second request (should hit cache)
        files = {"file": ("test.jpg", VALID_JPEG, "image/jpeg")}
        headers = {"X-API-Key": "dev-secret-key"}
        response2 = client.post("/api/v1/process-ocr", files=files, headers=headers)
        assert response2.status_code == 200
        assert response2.json()["ok"] is True
        
        # Verify OCR service was called only once (for the first request)
        assert mock_ocr_service.extract_text.call_count == 1

def test_cache_miss(mock_services):
    mock_ocr_service = mock_services["ocr"]
    
    with patch.object(settings, 'CACHE_ENABLED', True):
        InMemoryCacheStorage()._initialize()
        InMemoryCacheStorage().clear()
        
        # First request
        files1 = {"file": ("test1.jpg", VALID_JPEG, "image/jpeg")}
        headers = {"X-API-Key": "dev-secret-key"}
        client.post("/api/v1/process-ocr", files=files1, headers=headers)
        
        # Second request (different content - append a byte)
        files2 = {"file": ("test2.jpg", VALID_JPEG + b"\x00", "image/jpeg")}
        headers = {"X-API-Key": "dev-secret-key"}
        client.post("/api/v1/process-ocr", files=files2, headers=headers)
        
        # Verify OCR service was called twice
        assert mock_ocr_service.extract_text.call_count == 2
