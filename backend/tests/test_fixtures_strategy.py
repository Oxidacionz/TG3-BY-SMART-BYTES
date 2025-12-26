import pytest
import os
from PIL import Image
from app.services.ocr_service import TesseractService
from app.services.strategies.registry import select_strategy_by_text
from app.services.strategies.venezuela import BancoVenezuelaStrategy
from app.services.strategies.bancamiga import BancamigaStrategy

# Define fixtures as a list of tuples (path, expected_class)
FIXTURES = [
    ("tests/fixtures/comprobante-desde-bancamiga.jpeg", BancamigaStrategy),
    ("tests/fixtures/comprobante-desde-banco-de-venezuela-blanco.jpeg", BancoVenezuelaStrategy),
    ("tests/fixtures/comprobante-desde-banco-de-venezuela.jpeg", BancoVenezuelaStrategy),
]

@pytest.fixture
def ocr_service():
    return TesseractService()

@pytest.mark.integration
@pytest.mark.parametrize("image_path, expected_strategy_class", FIXTURES)
def test_strategy_selection_from_fixtures(ocr_service, image_path, expected_strategy_class):
    """
    Verifies that the correct strategy is selected for a given fixture image.
    This is an integration test as it uses the real OCR service.
    """
    full_path = os.path.abspath(image_path)
    
    if not os.path.exists(full_path):
        pytest.skip(f"Fixture file not found: {full_path}")

    with Image.open(full_path) as img:
        text = ocr_service.extract_text(img)
        strategy = select_strategy_by_text(text)
        
        assert isinstance(strategy, expected_strategy_class), \
            f"Expected {expected_strategy_class.__name__}, but got {strategy.__class__.__name__} for {image_path}"
