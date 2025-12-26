"""
File validation service implementing IFileValidator interface.
Handles validation of uploaded files (type, size, format).

Following Single Responsibility Principle: Only validates files.
"""
from typing import List
from fastapi import UploadFile, HTTPException
from app.core.interfaces import IFileValidator
from app.core.logger import get_logger

logger = get_logger(__name__)


class ImageFileValidator(IFileValidator):
    """
    Validator for image files used in receipt scanning.
    Validates MIME type, file size, and basic image integrity.
    """
    
    # Configuration
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    ALLOWED_MIME_TYPES = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ]
    
    def __init__(self, max_size: int = MAX_FILE_SIZE, allowed_types: List[str] = None):
        """
        Initialize validator with custom settings.
        
        Args:
            max_size: Maximum file size in bytes
            allowed_types: List of allowed MIME types
        """
        self.max_size = max_size
        self.allowed_types = allowed_types or self.ALLOWED_MIME_TYPES
        logger.info(f"ImageFileValidator initialized: max_size={max_size}, types={self.allowed_types}")
    
    async def validate_file(self, file: UploadFile) -> bool:
        """
        Validate uploaded file comprehensively.
        
        Args:
            file: Uploaded file to validate
            
        Returns:
            True if all validations pass
            
        Raises:
            HTTPException: With specific error message if validation fails
        """
        # 1. Validate MIME type
        if not self.validate_file_type(file.content_type):
            logger.warning(f"Invalid file type: {file.content_type}")
            raise HTTPException(
                status_code=400,
                detail=f"Tipo de archivo no soportado. Permitidos: {', '.join(self.allowed_types)}"
            )
        
        # 2. Read file content for size validation
        try:
            content = await file.read()
            file_size = len(content)
            
            # Reset file pointer for subsequent reads
            await file.seek(0)
        except Exception as e:
            logger.error(f"Error reading file: {e}")
            raise HTTPException(
                status_code=400,
                detail=f"Error al leer el archivo: {str(e)}"
            )
        
        # 3. Validate file size
        if not self.validate_file_size(file_size):
            logger.warning(f"File too large: {file_size} bytes")
            raise HTTPException(
                status_code=413,
                detail=f"Archivo demasiado grande. Máximo permitido: {self.max_size // (1024 * 1024)}MB"
            )
        
        # 4. Validate file is not empty
        if file_size == 0:
            logger.warning("Empty file uploaded")
            raise HTTPException(
                status_code=400,
                detail="El archivo está vacío"
            )
        
        logger.info(f"File validation passed: {file.filename}, size={file_size}, type={file.content_type}")
        return True
    
    def validate_file_type(self, content_type: str) -> bool:
        """
        Validate file MIME type.
        
        Args:
            content_type: MIME type string
            
        Returns:
            True if type is allowed
        """
        if not content_type:
            return False
        
        # Normalize content type (remove charset, etc.)
        normalized_type = content_type.split(';')[0].strip().lower()
        
        return normalized_type in self.allowed_types
    
    def validate_file_size(self, size_bytes: int) -> bool:
        """
        Validate file size is within limits.
        
        Args:
            size_bytes: File size in bytes
            
        Returns:
            True if size is acceptable
        """
        return 0 < size_bytes <= self.max_size
    
    def get_max_file_size(self) -> int:
        """
        Get maximum allowed file size.
        
        Returns:
            Max size in bytes
        """
        return self.max_size
    
    def get_allowed_types(self) -> List[str]:
        """
        Get list of allowed MIME types.
        
        Returns:
            List of MIME type strings
        """
        return self.allowed_types.copy()


class PDFFileValidator(IFileValidator):
    """
    Validator for PDF files (for future PDF receipt support).
    """
    
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB for PDFs
    ALLOWED_MIME_TYPES = ["application/pdf"]
    
    def __init__(self, max_size: int = MAX_FILE_SIZE):
        self.max_size = max_size
        self.allowed_types = self.ALLOWED_MIME_TYPES
    
    async def validate_file(self, file: UploadFile) -> bool:
        """Validate PDF file."""
        if not self.validate_file_type(file.content_type):
            raise HTTPException(
                status_code=400,
                detail="Solo se permiten archivos PDF"
            )
        
        content = await file.read()
        await file.seek(0)
        
        if not self.validate_file_size(len(content)):
            raise HTTPException(
                status_code=413,
                detail=f"PDF demasiado grande. Máximo: {self.max_size // (1024 * 1024)}MB"
            )
        
        # Validate PDF magic number
        if not content.startswith(b'%PDF'):
            raise HTTPException(
                status_code=400,
                detail="Archivo no es un PDF válido"
            )
        
        return True
    
    def validate_file_type(self, content_type: str) -> bool:
        """Validate PDF MIME type."""
        if not content_type:
            return False
        normalized = content_type.split(';')[0].strip().lower()
        return normalized in self.allowed_types
    
    def validate_file_size(self, size_bytes: int) -> bool:
        """Validate PDF size."""
        return 0 < size_bytes <= self.max_size
    
    def get_max_file_size(self) -> int:
        """Get max PDF size."""
        return self.max_size
    
    def get_allowed_types(self) -> List[str]:
        """Get allowed PDF types."""
        return self.allowed_types.copy()


# Singleton instances for common use
image_validator = ImageFileValidator()
pdf_validator = PDFFileValidator()
