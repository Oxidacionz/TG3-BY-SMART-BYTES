from abc import ABC, abstractmethod
from app.schemas.ocr_result import OCRResult

class FallbackExtractor(ABC):
    """
    Abstract base class for fallback extraction strategies.
    Each extractor is responsible for trying to recover specific fields
    from the raw text if they are missing in the parsed result.
    """
    
    @abstractmethod
    def extract(self, text: str, current_result: OCRResult) -> None:
        """
        Attempts to extract data from 'text' and update 'current_result' in place.
        """
        pass
