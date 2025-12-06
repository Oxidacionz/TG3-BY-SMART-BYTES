from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image
import io
from decimal import Decimal
from typing import Optional

from app.services.ocr_service import TesseractService
from app.services.parser_service import ReceiptParser
from app.schemas.receipt import TransactionReceipt, FinancialPlatform, Currency
from app.core.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()

def map_bank_name_to_platform(bank_name: Optional[str]) -> FinancialPlatform:
    if not bank_name:
        return FinancialPlatform.UNKNOWN
    
    normalized = bank_name.upper()
    if "BANESCO" in normalized:
        return FinancialPlatform.BANESCO_VE
    if "MERCANTIL" in normalized:
        return FinancialPlatform.MERCANTIL_VE
    if "VENEZUELA" in normalized or "BDV" in normalized:
        return FinancialPlatform.BDV
    if "PROVINCIAL" in normalized:
        return FinancialPlatform.PROVINCIAL
    if "ZELLE" in normalized:
        return FinancialPlatform.ZELLE
    if "BINANCE" in normalized:
        return FinancialPlatform.BINANCE
    
    return FinancialPlatform.UNKNOWN

def map_currency(amount_type: Optional[str]) -> Currency:
    if not amount_type:
        return Currency.VES # Default assumption if missing? Or maybe USD depending on bank?
    
    normalized = amount_type.upper()
    if "USD" in normalized or "$" in normalized:
        return Currency.USD
    if "BS" in normalized or "VES" in normalized:
        return Currency.VES
    if "EUR" in normalized:
        return Currency.EUR
    if "USDT" in normalized:
        return Currency.USDT
        
    return Currency.VES

@router.post("/", response_model=TransactionReceipt)
async def scan_receipt(file: UploadFile = File(...)):
    """
    Endpoint de Escaneo usando Scripts Locales (Tesseract + Regex).
    Procesa la imagen localmente sin enviar datos a APIs externas.
    """
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
         raise HTTPException(status_code=400, detail="Solo se soportan imagenes JPG/PNG.")
    
    try:
        # 1. Leer Imagen
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # 2. Extraccion de Texto (Tesseract Local)
        ocr_service = TesseractService()
        raw_text = ocr_service.extract_text(image, lang="spa")
        
        # 3. Parsing (Regex Locales)
        parser = ReceiptParser()
        ocr_result = parser.parse(raw_text)
        
        # 4. Mapeo a Esquema Unificado (TransactionReceipt)
        # Convertimos el resultado del script local al formato robusto que espera el frontend
        
        amount_decimal = Decimal(str(ocr_result.amount_value)) if ocr_result.amount_value is not None else Decimal("0.00")
        platform = map_bank_name_to_platform(ocr_result.bankName)
        currency = map_currency(ocr_result.amount_type)
        
        # Heuristicas extra si faltan datos
        if platform == FinancialPlatform.ZELLE:
            currency = Currency.USD
        
        return TransactionReceipt(
            platform=platform,
            amount=amount_decimal,
            currency=currency,
            reference_id=ocr_result.identification,
            transaction_date=None, # La fecha del parser suele ser string, habria que parsearla a datetime. Dejamos None o implementamos parser fecha.
            sender_name=ocr_result.origin,
            receiver_name=ocr_result.destination,
            raw_text_snippet=raw_text[:200] # Primeros caracteres para debug
        )

    except Exception as e:
        logger.error(f"Error en procesado local: {e}")
        # En caso de error, devolvemos un objeto vacio/error controlado o raise
        raise HTTPException(status_code=500, detail=f"Error interno de procesamiento: {str(e)}")
