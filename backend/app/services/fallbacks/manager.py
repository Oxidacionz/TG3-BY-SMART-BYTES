from typing import List
from app.services.fallbacks.base import FallbackExtractor
from app.schemas.ocr_result import OCRResult

class FallbackManager:
    def __init__(self, extractors: List[FallbackExtractor]):
        self.extractors = extractors

    def apply_fallbacks(self, text: str, result: OCRResult) -> OCRResult:
        """
        Applies all registered fallback extractors sequentially to the result.
        """
        for extractor in self.extractors:
            extractor.extract(text, result)
        return result
