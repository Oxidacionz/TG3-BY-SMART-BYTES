from abc import ABC, abstractmethod
from typing import Dict, Any
import asyncio
from fastapi import UploadFile
from app.core.logger import get_logger
from app.core.config import settings
from app.services.image_service import ImageService
from app.services.interfaces import OCREngine
from app.services.parser_service import ReceiptParser
from app.cache.manager import CacheManager
from app.core.banks import get_bank_name, get_bank_code
from app.services.merger_service import ResultMerger
from app.services.inference_service import BankInferenceService
from app.services.interfaces import IReceiptParser
from PIL import Image
import io
import time

logger = get_logger(__name__)

class ReceiptProcessor(ABC):
    @abstractmethod
    async def process(self, file: UploadFile) -> Dict[str, Any]:
        pass

from app.services.interfaces import INormalizationService

class StandardReceiptProcessor(ReceiptProcessor):
    def __init__(
        self,
        image_service: ImageService,
        ocr_service: OCREngine,
        parser_service: IReceiptParser,
        result_merger: ResultMerger,
        bank_inference_service: BankInferenceService,
        normalization_service: INormalizationService
    ):
        self.image_service = image_service
        self.ocr_service = ocr_service
        self.parser_service = parser_service
        self.result_merger = result_merger
        self.bank_inference_service = bank_inference_service
        self.normalization_service = normalization_service

    async def process(self, file: UploadFile) -> Dict[str, Any]:
        # 1. Read file
        file_bytes = await file.read()
        
        # Reset cursor for potential future reads (though we use bytes here)
        await file.seek(0)

        # 2. Validate Content-Length
        if len(file_bytes) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
             raise ValueError(f"File too large. Max size is {settings.MAX_FILE_SIZE_MB}MB")

        # 3. Validate Magic Numbers
        if not file_bytes.startswith(b'\xff\xd8\xff') and not file_bytes.startswith(b'\x89PNG\r\n\x1a\n'):
             try:
                 Image.open(io.BytesIO(file_bytes)).verify()
             except Exception:
                 raise ValueError("Invalid image file format")

        # 4. OCR Pipeline
        # Pass 1: Standard
        start_time = time.time()
        pil_img = self.image_service.preprocess(file_bytes, aggressive=False)
        
        loop = asyncio.get_running_loop()
        text = await loop.run_in_executor(None, self.ocr_service.extract_text, pil_img, 6, 1)
        
        result = self.parser_service.parse(text)
        result.raw_text = text
        
        # Check quality
        if result.amount_value is None or not result.date:
            logger.info("OCR Pass 1 (Standard) yielded incomplete results. Retrying with Aggressive mode.")
            
            # Pass 2: Aggressive
            start_time_2 = time.time()
            pil_aggr = self.image_service.preprocess(file_bytes, aggressive=True)
            text_aggr = await loop.run_in_executor(None, self.ocr_service.extract_text, pil_aggr, 6, 1)
            result_aggr = self.parser_service.parse(text_aggr)
            result_aggr.raw_text = text_aggr
            logger.info(f"Pass 2 (Aggressive) took {time.time() - start_time_2:.2f}s")
            
            # Smart Merge (Delegated)
            result = self.result_merger.merge(result, result_aggr)
            
            # Combine raw texts for audit
            result.raw_text = f"=== STANDARD ===\n{text}\n\n=== AGGRESSIVE ===\n{text_aggr}"

        # Inference Logic (Delegated)
        # Decoupled call: pass primitives, get primitives
        code, name = self.bank_inference_service.infer_missing_bank_data(result.bankCode, result.bankName)
        result.bankCode = code
        result.bankName = name

        # Prepare dict
        if hasattr(result, "model_dump"):
            data = result.model_dump()
        else:
            data = result.dict()

        # Normalization Logic (Delegated)
        data = self.normalization_service.normalize(data)

        # Validate required fields
        required = [
            "amount_value", "date", "operation", "identification",
            "destination", "bankName"
        ]
        missing = [k for k in required if data.get(k) is None or (isinstance(data.get(k), str) and data.get(k).strip() == "")]

        if missing:
            logger.warning(f"process_ocr: missing required fields: {missing}")
            raise ValueError(f"Missing required fields: {', '.join(missing)}")

        return data

class CachedReceiptProcessor(ReceiptProcessor):
    def __init__(self, inner: ReceiptProcessor, cache_manager: CacheManager):
        self.inner = inner
        self.cache_manager = cache_manager

    async def process(self, file: UploadFile) -> Dict[str, Any]:
        # Read bytes to compute hash
        file_bytes = await file.read()
        await file.seek(0) # Important: reset cursor for the inner processor

        # Check Cache
        cached_result = self.cache_manager.get(file_bytes)
        if cached_result:
            logger.info("Cache Hit via CachedReceiptProcessor")
            return cached_result

        # Process
        result = await self.inner.process(file)

        # Save Cache
        self.cache_manager.set(file_bytes, result)
        
        return result
