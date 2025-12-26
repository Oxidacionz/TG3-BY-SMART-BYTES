"""
Scanner API endpoint implementing SOLID principles.
Handles receipt image upload and processing.

Following Dependency Inversion: Depends on IFileValidator and IImageProcessor interfaces.
"""
from fastapi import APIRouter, File, UploadFile, HTTPException

from app.schemas.receipt import TransactionReceipt
from app.core.logger import get_logger
from app.services.file_validator import image_validator
from app.services.scanner_factory import get_default_scanner

logger = get_logger(__name__)
router = APIRouter()


@router.post("/", response_model=TransactionReceipt)
async def scan_receipt(file: UploadFile = File(...)):
    """
    Scan and process a receipt image using AI.
    
    This endpoint:
    1. Validates the uploaded file (type, size)
    2. Processes the image using the configured scanner (Gemini, Tesseract, etc.)
    3. Returns structured transaction data
    
    Args:
        file: Uploaded image file (JPEG, PNG, WEBP)
        
    Returns:
        TransactionReceipt with extracted data
        
    Raises:
        HTTPException 400: Invalid file type or format
        HTTPException 413: File too large
        HTTPException 422: Processing failed
        HTTPException 500: Internal server error
    """
    try:
        # 1. Validate file using IFileValidator
        await image_validator.validate_file(file)
        
        # 2. Get scanner instance from factory
        scanner = get_default_scanner()
        
        # 3. Process image using IImageProcessor
        result = await scanner.process_image(file)
        
        logger.info(
            f"Receipt scanned successfully: "
            f"platform={result.platform.value}, "
            f"amount={result.amount} {result.currency.value}"
        )
        
        return result
        
    except HTTPException:
        # Re-raise HTTP exceptions (from validator or scanner)
        raise
    except Exception as e:
        # Catch any unexpected errors
        logger.error(f"Unexpected error in scan_receipt endpoint: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/health", tags=["Health"])
async def scanner_health():
    """
    Health check for scanner service.
    
    Returns:
        Status information about the scanner service
    """
    try:
        scanner = get_default_scanner()
        provider = scanner.get_provider_name()
        
        return {
            "status": "ok",
            "provider": provider,
            "max_file_size_mb": image_validator.get_max_file_size() // (1024 * 1024),
            "allowed_types": image_validator.get_allowed_types()
        }
    except Exception as e:
        logger.error(f"Scanner health check failed: {e}")
        return {
            "status": "error",
            "error": str(e)
        }
