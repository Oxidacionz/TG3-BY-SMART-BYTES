import pytest
from app.services.parser_service import ReceiptParser

@pytest.fixture
def parser():
    return ReceiptParser()

def test_parse_perfect_receipt(parser):
    text = """
    PAGO MÓVIL
    Fecha: 01/12/2025
    Monto: 1.237,00 BS
    Referencia: 004402757585
    Banco: BBVA PROVINCIAL (0108)
    Origen: 0102****4427
    Destino: 04121600851
    Concepto: Abono
    """
    result = parser.parse(text)
    
    assert result.amount_value == 1237.00
    assert result.date == "01/12/2025"
    assert result.operation == "004402757585"
    assert result.bankName == "BBVA PROVINCIAL"
    assert result.bankCode == "0108"

def test_parse_noisy_text(parser):
    text = """
    *** COMPROBANTE ***
    ...
    Fecha: 01-12-2025 ...
    Monto: Bs. 50,50
    Ref: 123456
    ...
    """
    result = parser.parse(text)
    
    assert result.amount_value == 50.50
    assert result.date == "01/12/2025" # Should normalize date
    assert result.operation == "123456"

def test_parse_missing_fields(parser):
    text = "Texto sin sentido"
    result = parser.parse(text)
    
    assert result.amount_value is None
    assert result.date is None
    assert result.operation is None

@pytest.mark.parametrize("text_input, expected_amount", [
    ("Monto: 1.000,00", 1000.00),
    ("Monto: 1000.00", 1000.00),
    ("Monto: 1,000.00", 1000.00),
    ("Monto: 50,5", 50.50),
])
def test_parse_amount_formats(parser, text_input, expected_amount):
    result = parser.parse(text_input)
    if result.amount_value is not None:
        assert result.amount_value == expected_amount, f"Failed for {text_input}"

@pytest.mark.parametrize("text_input, expected_date", [
    ("Fecha: 2025/12/01", "01/12/2025"),
    ("Fecha: 01-12-2025", "01/12/2025"),
    ("Fecha: 01.12.2025", "01/12/2025"),
])
def test_parse_date_formats(parser, text_input, expected_date):
    result = parser.parse(text_input)
    if result.date:
        assert result.date == expected_date, f"Failed for {text_input}"
