import os
import json
import google.generativeai as genai
from fastapi import UploadFile, HTTPException
from app.schemas.receipt import TransactionReceipt
from app.core.prompts import SYSTEM_PROMPT
from app.core.config import settings
from app.core.logger import get_logger

logger = get_logger(__name__)

class SmartScannerService:
    """
    Singleton service for processing receipts with Google Gemini AI.
    Uses round-robin key rotation for load distribution.
    """
    _instance = None
    _current_key_index = 0

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        # Only initialize once
        if self._initialized:
            return
            
        self.keys = settings.GEMINI_KEYS
        if not self.keys:
            logger.error("No Gemini API keys configured")
            self.model = None
        else:
            # Initialize with first key
            self.api_key = self.keys[0]
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('models/gemini-flash-latest')
            logger.info(f"SmartScannerService initialized with {len(self.keys)} key(s)")
        
        self._initialized = True

    def _get_next_key(self):
        """Get next API key using round-robin"""
        if not self.keys:
            return None
        idx = SmartScannerService._current_key_index % len(self.keys)
        SmartScannerService._current_key_index += 1
        return self.keys[idx]

    async def process_receipt_image(self, file: UploadFile) -> TransactionReceipt:
        """
        Processes an image file using Google Gemini to extract financial data.
        """
        if not self.model:
             raise HTTPException(
                 status_code=500, 
                 detail="Gemini API Key not configured. Please set GEMINI_API_KEY in environment variables."
             )

        try:
            # 1. Read image content
            content = await file.read()
            
            # 2. Get next key for this request (round-robin)
            next_key = self._get_next_key()
            if next_key != self.api_key:
                self.api_key = next_key
                genai.configure(api_key=self.api_key)
            
            # 3. Prepare the prompt and image parts
            image_part = {
                "mime_type": file.content_type or "image/jpeg",
                "data": content
            }
            
            prompt = f"""
            {SYSTEM_PROMPT}
            
            Analiza este comprobante bancario y extrae los datos en formato JSON.
            """

            # 4. Call Gemini
            generation_config = genai.GenerationConfig(
                response_mime_type="application/json"
            )
            
            response = self.model.generate_content(
                [prompt, image_part],
                generation_config=generation_config
            )
            
            # 5. Parse response
            raw_text = response.text
            # Clean up potential markdown code blocks
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
                
            json_data = json.loads(raw_text.strip())
            
            logger.info(f"Successfully processed receipt", extra={
                "platform": json_data.get("platform"),
                "amount": json_data.get("amount"),
                "file_size": len(content)
            })
            
            return TransactionReceipt.model_validate(json_data)

        except Exception as e:
            logger.error(f"Gemini Scanner Error: {str(e)}", extra={
                "file_name": file.filename,
                "content_type": file.content_type
            })
            raise HTTPException(status_code=422, detail=f"Error processing document with Gemini: {str(e)}")


# Singleton instance
scanner_service = SmartScannerService()
