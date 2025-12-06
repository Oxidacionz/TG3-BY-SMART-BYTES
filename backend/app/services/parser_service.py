import re
from app.schemas.ocr_result import OCRResult
from app.services.strategies import select_strategy_by_text
from app.core.logger import get_logger
from app.services.fallbacks.manager import FallbackManager
from app.services.fallbacks.extractors import (
    BankNameFallback, BankCodeFallback, AmountFallback, 
    DateFallback, IdentificationFallback, OriginDestinationFallback, 
    ConceptFallback
)

from app.services.interfaces import IReceiptParser

logger = get_logger(__name__)

class ReceiptParser(IReceiptParser):
    def __init__(self):
        # Initialize Fallback Manager with all extractors
        # Order matters!
        self.fallback_manager = FallbackManager([
            BankNameFallback(),
            BankCodeFallback(),
            AmountFallback(),
            IdentificationFallback(),
            OriginDestinationFallback(),
            DateFallback(),
            ConceptFallback()
        ])

    def parse(self, text: str) -> OCRResult:
        """
        Parses fields using Strategy Pattern and robust fallback extractors.
        """
        # 1. Strategy Parsing
        strategy = select_strategy_by_text(text)
        parsed_data = strategy.parse(text)

        # Convert ParseResult to OCRResult (initial)
        # We create an initial OCRResult to pass to fallbacks
        result = OCRResult(
            amount=parsed_data.amount,
            amount_value=None, # Will be calculated in AmountFallback if needed
            amount_type=None,
            date=parsed_data.date,
            operation=parsed_data.operation,
            identification=parsed_data.identification,
            origin=parsed_data.origin,
            destination=parsed_data.destination,
            bankCode=parsed_data.bankCode,
            bankName=parsed_data.bankName,
            concept=parsed_data.concept,
        )

        # 2. Apply Fallbacks (Chain of Responsibility)
        # The manager will update 'result' in place
        self.fallback_manager.apply_fallbacks(text, result)

        logger.debug(f"Resultado OCR (strategy+fallbacks): {result.model_dump() if hasattr(result, 'model_dump') else result.dict()}")
        return result

