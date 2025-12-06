from abc import ABC, abstractmethod
from PIL import Image
from app.schemas.ocr_result import OCRResult

class OCREngine(ABC):
    @abstractmethod
    def extract_text(self, image: Image.Image, **kwargs) -> str:
        """
        Extract text from an image.
        """
        pass

class IReceiptParser(ABC):
    @abstractmethod
    def parse(self, text: str) -> OCRResult:
        """
        Parse text into structured OCRResult.
        """
        pass

from typing import Dict, Any

class INormalizationRule(ABC):
    @abstractmethod
    def apply(self, data: Dict[str, Any]) -> None:
        """
        Apply normalization rule to data in-place.
        """
        pass

class INormalizationService(ABC):
    @abstractmethod
    def normalize(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalize data using registered rules.
        """
        pass
