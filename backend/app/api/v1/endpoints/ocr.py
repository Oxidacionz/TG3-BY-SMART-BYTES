from fastapi import APIRouter, UploadFile, File, Depends, Request, Response
from app.core.config import settings
from app.core.logger import get_logger
from app.core.limiter import limiter
from app.services.image_service import ImageService
from app.services.ocr_service import TesseractService
from app.services.parser_service import ReceiptParser
from app.services.interfaces import OCREngine, IReceiptParser
from app.services.processor_service import ReceiptProcessor, StandardReceiptProcessor, CachedReceiptProcessor
from app.cache.manager import CacheManager
from app.core.security import get_api_key

from app.services.merger_service import ResultMerger
from app.services.inference_service import BankInferenceService
from app.services.interfaces import IReceiptParser

logger = get_logger(__name__)

router = APIRouter()

from app.services.normalization_service import NormalizationService
from app.services.normalization_rules import (
    DateNormalizationRule, 
    IdentificationNormalizationRule, 
    AmountNormalizationRule,
    BankNameNormalizationRule,
    ConceptNormalizationRule
)
from app.services.interfaces import INormalizationService

def get_normalization_service() -> INormalizationService:
    rules = [
        DateNormalizationRule(),
        IdentificationNormalizationRule(),
        AmountNormalizationRule(),
        BankNameNormalizationRule(),
        ConceptNormalizationRule()
    ]
    return NormalizationService(rules)

def get_processor_service(
    image_service: ImageService = Depends(ImageService),
    ocr_service: OCREngine = Depends(TesseractService),
    parser_service: IReceiptParser = Depends(ReceiptParser),
    result_merger: ResultMerger = Depends(ResultMerger),
    bank_inference_service: BankInferenceService = Depends(BankInferenceService),
    normalization_service: INormalizationService = Depends(get_normalization_service)
) -> ReceiptProcessor:
    # 1. Create Standard Processor
    standard = StandardReceiptProcessor(
        image_service, 
        ocr_service, 
        parser_service,
        result_merger,
        bank_inference_service,
        normalization_service
    )
    
    # 2. Wrap with Cache Decorator
    # Note: CacheManager uses default strategies (SHA256 + InMemory)
    cache_manager = CacheManager()
    return CachedReceiptProcessor(standard, cache_manager)


@router.post("/process-ocr")
@limiter.limit(settings.RATE_LIMIT_DEFAULT)
async def process_ocr(
    request: Request,
    response: Response,
    file: UploadFile = File(...),
    processor: ReceiptProcessor = Depends(get_processor_service),
    api_key: str = Depends(get_api_key)
):
    try:
        data = await processor.process(file)
        return {"ok": True, "data": data}
    except ValueError as e:
        return {"ok": False, "error": str(e)}
    except Exception as e:
        logger.error(f"process_ocr: exception: {repr(e)}")
        return {"ok": False, "error": "OCR processing failed"}
