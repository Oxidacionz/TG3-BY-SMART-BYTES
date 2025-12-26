import google.generativeai as genai
from typing import Dict, Any, List
import json
import asyncio
from datetime import datetime

# Corrected Imports for Modular Architecture
from src.shared.config.settings import settings
from src.shared.config.logger import logger
from src.shared.config.prompts import GEMINI_SYSTEM_PROMPT
from src.transactions.domain.transaction import Transaction 
from src.scanner.application.parsers import GeminiResponseParser, ReceiptDataMapper
from src.scanner.application.validators import ImageFileValidator

class GeminiScannerService:
    """
    Application Service for scanning receipts using Gemini AI.
    Orchestrates the flow: Validate -> Send to AI -> Parse -> Map -> Return Transaction
    """
    def __init__(self):
        # Load keys FIRST so configure_genai works
        self.api_keys = settings.parsed_api_keys
        self.current_key_index = 0
        
        # Check if using default key
        if not self.api_keys:
             logger.warning("⚠️ ADD_KEY: No API Keys found in settings.")
        elif "your-key-here" in self.api_keys:
            logger.warning("⚠️ USING DEFAULT PLACEHOLDER API KEY. SCANNING WILL FAIL.")

        if self.api_keys:
            self._configure_genai()
        
        self.validator = ImageFileValidator(
            max_size_mb=settings.GEMINI_SCANNER_MAX_FILE_SIZE_MB,
            allowed_types=settings.GEMINI_SCANNER_ALLOWED_MIME_TYPES
        )
        self.parser = GeminiResponseParser()
        self.mapper = ReceiptDataMapper()

    def _configure_genai(self):
        """Configures the GenAI client with the current key"""
        try:
            current_key = self._get_next_key()
            if not current_key or "your-key-here" in current_key:
                # logger.error(f"❌ INVALID API KEY")
                # raise ValueError("Invalid API Key configuration")
                pass # Don't crash in init
            
            masked_key = f"{current_key[:5]}...{current_key[-4:]}"
            logger.info(f"🔄 Configuring GenAI with key: {masked_key}")
            
            genai.configure(api_key=current_key)
        except Exception as e:
            logger.error(f"Failed to configure GenAI: {e}")
            # raise # Don't crash logic yet

    def _get_next_key(self) -> str:
        """Simple strategy to rotate API key"""
        if not self.api_keys:
            return ""
        key = self.api_keys[self.current_key_index]
        self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
        return key

    async def scan_receipt(self, file_content: bytes, filename: str, content_type: str) -> Transaction:
        """
        Main use case: Scan a receipt image and return extracted data as Transaction.
        """
        if not self.api_keys:
             raise ValueError("No Gemini API Keys configured")

        # 1. Validate
        await self.validator.validate(file_content, filename, content_type)
        
        # 2. Process with AI (Retry logic included)
        raw_response = await self._call_gemini_with_retry(file_content, content_type)
        
        # 3. Parse Response
        parsed_data = self.parser.parse(raw_response)
        
        # 4. Map to Domain (Using shared Transaction model)
        receipt = self.mapper.to_domain(parsed_data)
        
        logger.info(f"Successfully scanned receipt: {receipt.reference_id} from {receipt.platform}")
        return receipt

    async def _call_gemini_with_retry(self, image_bytes: bytes, mime_type: str) -> str:
        """
        Calls Gemini API with manual retry on Quota Exceeded or Auth Errors.
        """
        retries = 0
        max_retries = settings.GEMINI_SCANNER_MAX_RETRIES
        
        while retries <= max_retries:
            try:
                model_name = settings.GEMINI_SCANNER_MODEL_NAME
                logger.info(f"🤖 Creating GenerativeModel with name: {model_name}")
                model = genai.GenerativeModel(model_name)
                
                response = await asyncio.to_thread(
                    model.generate_content,
                    contents=[
                        GEMINI_SYSTEM_PROMPT,
                        {"mime_type": mime_type, "data": image_bytes}
                    ],
                    generation_config={
                        "temperature": settings.GEMINI_SCANNER_TEMPERATURE,
                        "max_output_tokens": settings.GEMINI_SCANNER_MAX_OUTPUT_TOKENS
                    }
                )
                
                return response.text

            except Exception as e:
                logger.warning(f"Gemini API Error (Attempt {retries+1}/{max_retries}): {str(e)}")
                retries += 1
                
                # Rotate key on error
                if "429" in str(e) or "quota" in str(e).lower():
                    logger.info("Rotating API key due to quota/rate limit...")
                    self._configure_genai()
                
                if retries > max_retries:
                    logger.error("Max retries exceeded for Gemini API")
                    raise e
        
        raise RuntimeError("Unreachable code")

# Singleton
scanner_service = GeminiScannerService()
