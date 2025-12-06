import pytesseract
from PIL import Image
from app.services.interfaces import OCREngine
from app.core.config import settings

class TesseractService(OCREngine):
    def extract_text(self, image: Image.Image, psm: int = 6, oem: int = 1, lang: str = "spa") -> str:
        """
        Extracts text using pytesseract with adjustable parameters.
        
        - psm: Page Segmentation Mode
        - oem: OCR Engine Mode
        - lang: language (e.g. 'spa')
        """
        custom_config = f"-l {lang} --oem {oem} --psm {psm}"
        if settings.TESSDATA_DIR:
            custom_config += f" --tessdata-dir {settings.TESSDATA_DIR}"
        return pytesseract.image_to_string(image, config=custom_config)
