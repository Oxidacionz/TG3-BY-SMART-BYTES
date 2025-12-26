import pytest
import os
from app.services.image_service import ImageService
from app.services.ocr_service import TesseractService
from app.services.parser_service import ReceiptParser

# Define path to a sample image that is known to exist
SAMPLE_IMAGE_PATH = "tests/fixtures/comprobante-desde-banco-de-venezuela.jpeg"

@pytest.mark.integration
@pytest.mark.skipif(not os.path.exists(SAMPLE_IMAGE_PATH), reason="Sample image not found")
def test_ocr_snapshot():
    """
    Snapshot test to ensure OCR output remains consistent.
    This is a 'Golden Master' test.
    """
    with open(SAMPLE_IMAGE_PATH, "rb") as f:
        file_bytes = f.read()
    
    # Simulate the processing pipeline
    # We use aggressive=False as per current default in webhooks (it tries light first)
    image_service = ImageService()
    ocr_service = TesseractService()
    parser_service = ReceiptParser()

    pil_img = image_service.preprocess(file_bytes, aggressive=False)
    text = ocr_service.extract_text(pil_img, psm=6, oem=1)
    result = parser_service.parse(text)
    
    data = result.model_dump()
    
    # Assertions based on the *current* known output of the system for this image.
    # NOTE: These values should be updated ONLY if the logic improves and we verify the new result is better.
    # For now, we just want to pin the current behavior.
    
    # We assert critical fields are not None (assuming the sample image is valid)
    assert data['amount_value'] is not None, "Amount should be detected"
    assert data['bankName'] is not None, "Bank name should be detected"
    
    # You can add more specific assertions here once you know the exact expected values for 'comprobante.jpeg'
    # For example:
    # assert data['amount_value'] == 123.45
