"""
Gemini AI Scanner Service implementing IImageProcessor interface.
Processes receipt images using Google Gemini AI.

Following SOLID principles:
- Single Responsibility: Only orchestrates Gemini API calls
- Dependency Inversion: Depends on IResponseParser and IDataMapper interfaces
- Open/Closed: Extensible through composition
"""
import base64
import os
from typing import Optional
from fastapi import UploadFile, HTTPException
import google.generativeai as genai

from app.core.interfaces import IImageProcessor, IResponseParser, IDataMapper
from app.schemas.receipt import TransactionReceipt
from app.core.prompts import GEMINI_SYSTEM_PROMPT
from app.core.logger import get_logger
from app.services.response_parser import gemini_parser
from app.services.data_mapper import receipt_mapper

logger = get_logger(__name__)

# Global state for key rotation
_current_key_index = 0
_key_rotation_lock = False


class GeminiAPIClient:
    """
    Client for Google Gemini API communication.
    Handles API configuration and content generation.
    
    Following Single Responsibility: Only communicates with Gemini API.
    """
    
    def __init__(self, api_key: Optional[str] = None, model_name: str = "models/gemini-flash-latest", key_index: int = 0):
        """
        Initialize Gemini API client.
        
        Args:
            api_key: Google API key (defaults to config GEMINI_KEYS[key_index])
            model_name: Gemini model to use
            key_index: Index of key to use from GEMINI_KEYS list
        """
        from app.core.config import settings
        
        self.key_index = key_index
        
        # Use provided key, or key from config at specified index
        if api_key:
            self.api_key = api_key
            logger.info("Using provided Gemini API key")
        elif settings.GEMINI_KEYS and key_index < len(settings.GEMINI_KEYS):
            self.api_key = settings.GEMINI_KEYS[key_index]
            logger.info(f"Using Gemini API key #{key_index + 1} of {len(settings.GEMINI_KEYS)} available keys")
        else:
            self.api_key = None
            logger.warning(f"No Gemini API key available at index {key_index}. Total keys: {len(settings.GEMINI_KEYS) if hasattr(settings, 'GEMINI_KEYS') else 0}")
            
        self.model_name = model_name
        self.model = None
        
        if self.api_key:
            self._configure_api()
        else:
            logger.warning("No Gemini API key configured. Please set GEMINI_API_KEY or add keys to GEMINI_API_KEYS.txt")
    
    def _configure_api(self):
        """Configure Gemini API with credentials and model."""
        try:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(
                model_name=self.model_name,
                generation_config={
                    "temperature": 0.1,  # Low temperature for consistent results
                    "max_output_tokens": 2048,
                }
            )
            logger.info(f"Gemini API configured with model: {self.model_name}")
        except Exception as e:
            logger.error(f"Failed to configure Gemini API: {e}")
            raise
    
    def generate_content(self, prompt: str, image_data: dict) -> str:
        """
        Generate content using Gemini API.
        
        Args:
            prompt: System prompt for the model
            image_data: Image data dictionary with mime_type and data
            
        Returns:
            Raw text response from Gemini
            
        Raises:
            HTTPException: If API call fails
        """
        if not self.model:
            raise HTTPException(
                status_code=500,
                detail="Gemini API Key not configured. Please add keys to GEMINI_API_KEYS.txt or set GEMINI_API_KEY environment variable."
            )
        
        try:
            logger.info(f"🔍 Sending request to Gemini model {self.model_name} (Key #{self.key_index + 1})...")
            response = self.model.generate_content(
                [prompt, image_data]
            )
            logger.info("✅ Gemini response received successfully.")
            return response.text
        except Exception as e:
            error_msg = str(e)
            logger.error(f"❌ Gemini API error with key #{self.key_index + 1}: {error_msg}")
            
            # Check if it's a quota/rate limit error
            is_quota_error = "quota" in error_msg.lower() or "429" in error_msg or "rate limit" in error_msg.lower()
            
            if is_quota_error:
                logger.warning(f"⚠️ Quota/rate limit error detected with key #{self.key_index + 1}")
                raise HTTPException(
                    status_code=429,
                    detail=f"Quota exceeded for current API key. Error: {error_msg}"
                )
            
            # Check for Model Not Found (404)
            if "not found" in error_msg.lower() or "404" in error_msg:
                logger.error(f"❌ Model {self.model_name} not found or not supported.")
                raise HTTPException(
                    status_code=500, # Configuration Error
                    detail=f"Model {self.model_name} not found. Check API configuration. Error: {error_msg}"
                )

            raise HTTPException(
                status_code=422,
                detail=f"Error calling Gemini API: {error_msg}"
            )


class GeminiScannerService(IImageProcessor):
    """
    Gemini AI-based receipt scanner implementing IImageProcessor.
    
    Uses composition to delegate responsibilities:
    - GeminiAPIClient: API communication
    - IResponseParser: Response parsing
    - IDataMapper: Data transformation
    """
    
    def __init__(
        self,
        api_client: Optional[GeminiAPIClient] = None,
        response_parser: Optional[IResponseParser] = None,
        data_mapper: Optional[IDataMapper] = None
    ):
        """
        Initialize Gemini scanner with dependencies.
        
        Args:
            api_client: Gemini API client (defaults to new instance)
            response_parser: Response parser (defaults to gemini_parser)
            data_mapper: Data mapper (defaults to receipt_mapper)
        """
        self.api_client = api_client or GeminiAPIClient()
        self.response_parser = response_parser or gemini_parser
        self.data_mapper = data_mapper or receipt_mapper
        self.max_retries = 3  # Max retries with different keys
        
        logger.info(f"🚀 GeminiScannerService initialized with retry support (max {self.max_retries} retries)")
    
    async def process_image(self, file: UploadFile) -> TransactionReceipt:
        """
        Process receipt image using Gemini AI.
        
        Args:
            file: Uploaded image file
            
        Returns:
            TransactionReceipt with extracted data
            
        Raises:
            HTTPException: If processing fails
        """
        try:
            # Try with rotation on quota errors
            return await self._process_with_rotation(file)
            
        except HTTPException:
            raise
        except ValueError as e:
            logger.error(f"❌ Validation error: {e}")
            raise HTTPException(
                status_code=422,
                detail=f"Failed to process receipt: {str(e)}"
            )
        except Exception as e:
            logger.error(f"❌ Unexpected error in GeminiScannerService: {e}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail=f"Internal error processing receipt: {str(e)}"
            )
    
    async def _process_with_rotation(self, file: UploadFile) -> TransactionReceipt:
        """
        Process image with automatic API key rotation on quota errors.
        
        Args:
            file: Uploaded image file
            
        Returns:
            TransactionReceipt with extracted data
            
        Raises:
            HTTPException: If all retries fail
        """
        from app.core.config import settings
        global _current_key_index
        
        total_keys = len(settings.GEMINI_KEYS) if settings.GEMINI_KEYS else 0
        logger.info(f"📊 Total available API keys: {total_keys}")
        
        if total_keys == 0:
            raise HTTPException(
                status_code=500,
                detail="No Gemini API keys configured. Please add keys to GEMINI_API_KEYS.txt"
            )
        
        last_error = None
        attempts = min(self.max_retries, total_keys)
        
        for attempt in range(attempts):
            try:
                # Calculate key index (rotate through available keys)
                key_index = (_current_key_index + attempt) % total_keys
                
                logger.info(f"🔄 Attempt {attempt + 1}/{attempts} using API key #{key_index + 1}")
                
                # Create new client with specific key
                client = GeminiAPIClient(key_index=key_index)
                
                # 1. Read and encode image
                image_data = await self._prepare_image(file)
                
                # 2. Call Gemini API
                logger.info(f"📤 Invoking Gemini API with prompt length {len(GEMINI_SYSTEM_PROMPT)}...")
                raw_response = client.generate_content(
                    GEMINI_SYSTEM_PROMPT,
                    image_data
                )
                
                # 3. Parse response
                logger.info("🔍 Parsing Gemini response...")
                parsed_data = self.response_parser.parse_response(raw_response)
                
                # 4. Map to TransactionReceipt
                logger.info("🗺️ Mapping to TransactionReceipt...")
                receipt = self.data_mapper.map_to_receipt(parsed_data)
                
                logger.info(
                    f"✅ Successfully processed receipt with key #{key_index + 1}: "
                    f"platform={receipt.platform.value}, "
                    f"amount={receipt.amount} {receipt.currency.value}"
                )
                
                # Update global key index for next request (load balancing)
                _current_key_index = (key_index + 1) % total_keys
                logger.info(f"🔄 Next request will start with key #{_current_key_index + 1}")
                
                return receipt
                
            except HTTPException as e:
                last_error = e
                
                # If quota error, try next key
                if e.status_code == 429:
                    logger.warning(f"⚠️ Quota error with key #{key_index + 1}, rotating to next key...")
                    continue
                else:
                    # Other HTTP errors, don't retry
                    logger.error(f"❌ HTTP error {e.status_code}: {e.detail}")
                    raise
            except Exception as e:
                last_error = e
                logger.error(f"❌ Unexpected error on attempt {attempt + 1}: {e}")
                # Don't retry on unexpected errors
                raise
        
        # All retries exhausted
        logger.error(f"❌ All {attempts} attempts failed. Last error: {last_error}")
        if isinstance(last_error, HTTPException):
            raise last_error
        raise HTTPException(
            status_code=500,
            detail=f"All API keys exhausted. Last error: {str(last_error)}"
        )
    
    async def _prepare_image(self, file: UploadFile) -> dict:
        """
        Prepare image for Gemini API.
        
        Args:
            file: Uploaded file
            
        Returns:
            Image data dictionary for Gemini
            
        Raises:
            HTTPException: If image preparation fails
        """
        try:
            # Read image content
            image_content = await file.read()
            
            # Encode to base64
            base64_image = base64.b64encode(image_content).decode('utf-8')
            
            # Prepare image data structure
            image_data = {
                "mime_type": file.content_type or "image/jpeg",
                "data": base64_image
            }
            
            logger.debug(f"Image prepared: type={file.content_type}, size={len(image_content)} bytes")
            return image_data
            
        except Exception as e:
            logger.error(f"Error preparing image: {e}")
            raise HTTPException(
                status_code=400,
                detail=f"Error reading image file: {str(e)}"
            )
    
    def get_provider_name(self) -> str:
        """
        Get scanner provider name.
        
        Returns:
            Provider name
        """
        return "gemini"


# Singleton instance for backward compatibility
gemini_scanner_service = GeminiScannerService()
