import cv2
import numpy as np
import io
from PIL import Image

class ImageService:
    def preprocess(self, file_bytes: bytes, aggressive: bool = False) -> Image.Image:
        """
        Convert bytes to PIL Image and apply preprocessing.
        
        aggressive: if True applies GaussianBlur + binary threshold (more aggressive for OCR)
        """
        # Pillow expects a file-like object; wrap raw bytes using BytesIO
        pil_img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        
        # Downscale if too large (max width 800px)
        if pil_img.width > 800:
            ratio = 800 / float(pil_img.width)
            new_height = int(float(pil_img.height) * float(ratio))
            pil_img = pil_img.resize((800, new_height), Image.Resampling.BILINEAR)

        cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

        # Grayscale
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)

        if aggressive:
            # Blur to remove fine noise
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            # Binary Threshold
            _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            denoised = cv2.medianBlur(thresh, 3)
        else:
            # Adaptive Threshold (less aggressive)
            bin_img = cv2.adaptiveThreshold(
                gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 49, 2
            )
            denoised = cv2.medianBlur(bin_img, 3)

        return Image.fromarray(denoised)
