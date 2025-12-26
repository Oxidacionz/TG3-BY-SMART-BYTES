"""
Core interfaces for the scanner system following SOLID principles.
These interfaces define contracts that concrete implementations must follow,
enabling Dependency Inversion and making the system extensible and testable.
"""
from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from datetime import datetime
from fastapi import UploadFile
from app.schemas.receipt import TransactionReceipt


class IImageProcessor(ABC):
    """
    Interface for receipt image processing services.
    Implementations: GeminiScannerService, TesseractScannerService, etc.
    
    Following Open/Closed Principle: Open for extension (new processors),
    closed for modification (interface remains stable).
    """
    
    @abstractmethod
    async def process_image(self, file: UploadFile) -> TransactionReceipt:
        """
        Process a receipt image and extract transaction data.
        
        Args:
            file: Uploaded image file
            
        Returns:
            TransactionReceipt with extracted data
            
        Raises:
            HTTPException: If processing fails
        """
        pass
    
    @abstractmethod
    def get_provider_name(self) -> str:
        """
        Get the name of the processing provider.
        
        Returns:
            Provider name (e.g., "gemini", "tesseract")
        """
        pass


class IReceiptRepository(ABC):
    """
    Interface for receipt persistence operations.
    Implementations: SQLiteReceiptRepository, SupabaseReceiptRepository
    
    Following Repository Pattern: Abstracts data access logic.
    """
    
    @abstractmethod
    async def save_receipt(self, receipt: TransactionReceipt, user_id: Optional[str] = None) -> str:
        """
        Save a transaction receipt to the database.
        
        Args:
            receipt: TransactionReceipt to save
            user_id: Optional user ID for multi-tenant systems
            
        Returns:
            ID of the saved receipt
            
        Raises:
            Exception: If save operation fails
        """
        pass
    
    @abstractmethod
    async def get_receipt(self, receipt_id: str) -> Optional[TransactionReceipt]:
        """
        Retrieve a receipt by ID.
        
        Args:
            receipt_id: Unique identifier of the receipt
            
        Returns:
            TransactionReceipt if found, None otherwise
        """
        pass
    
    @abstractmethod
    async def get_receipts_by_user(
        self, 
        user_id: str, 
        limit: int = 100, 
        offset: int = 0
    ) -> List[TransactionReceipt]:
        """
        Get all receipts for a specific user.
        
        Args:
            user_id: User identifier
            limit: Maximum number of receipts to return
            offset: Number of receipts to skip (pagination)
            
        Returns:
            List of TransactionReceipt objects
        """
        pass
    
    @abstractmethod
    async def get_receipts_by_date_range(
        self,
        start_date: datetime,
        end_date: datetime,
        user_id: Optional[str] = None
    ) -> List[TransactionReceipt]:
        """
        Get receipts within a date range.
        
        Args:
            start_date: Start of date range
            end_date: End of date range
            user_id: Optional user filter
            
        Returns:
            List of TransactionReceipt objects
        """
        pass
    
    @abstractmethod
    async def delete_receipt(self, receipt_id: str) -> bool:
        """
        Delete a receipt by ID.
        
        Args:
            receipt_id: Unique identifier of the receipt
            
        Returns:
            True if deleted successfully, False otherwise
        """
        pass


class IDatabaseAdapter(ABC):
    """
    Interface for database connection and operations.
    Implementations: SQLiteAdapter, SupabaseAdapter
    
    Following Strategy Pattern: Different database strategies can be swapped.
    """
    
    @abstractmethod
    async def connect(self) -> bool:
        """
        Establish connection to the database.
        
        Returns:
            True if connection successful
        """
        pass
    
    @abstractmethod
    async def disconnect(self) -> None:
        """Close database connection."""
        pass
    
    @abstractmethod
    async def execute_query(self, query: str, params: Optional[Dict[str, Any]] = None) -> Any:
        """
        Execute a database query.
        
        Args:
            query: SQL query or equivalent
            params: Query parameters
            
        Returns:
            Query result
        """
        pass
    
    @abstractmethod
    async def health_check(self) -> bool:
        """
        Check if database connection is healthy.
        
        Returns:
            True if healthy, False otherwise
        """
        pass
    
    @abstractmethod
    def get_adapter_type(self) -> str:
        """
        Get the type of database adapter.
        
        Returns:
            Adapter type (e.g., "sqlite", "supabase")
        """
        pass


class IFileValidator(ABC):
    """
    Interface for file validation services.
    Implementations: ImageFileValidator, PDFFileValidator
    
    Following Single Responsibility Principle: Only handles validation.
    """
    
    @abstractmethod
    async def validate_file(self, file: UploadFile) -> bool:
        """
        Validate an uploaded file.
        
        Args:
            file: Uploaded file to validate
            
        Returns:
            True if valid
            
        Raises:
            HTTPException: If validation fails with specific error message
        """
        pass
    
    @abstractmethod
    def validate_file_type(self, content_type: str) -> bool:
        """
        Validate file MIME type.
        
        Args:
            content_type: MIME type string
            
        Returns:
            True if valid type
        """
        pass
    
    @abstractmethod
    def validate_file_size(self, size_bytes: int) -> bool:
        """
        Validate file size.
        
        Args:
            size_bytes: File size in bytes
            
        Returns:
            True if size is acceptable
        """
        pass
    
    @abstractmethod
    def get_max_file_size(self) -> int:
        """
        Get maximum allowed file size.
        
        Returns:
            Max size in bytes
        """
        pass
    
    @abstractmethod
    def get_allowed_types(self) -> List[str]:
        """
        Get list of allowed MIME types.
        
        Returns:
            List of MIME type strings
        """
        pass


class IResponseParser(ABC):
    """
    Interface for parsing AI/OCR responses.
    Implementations: GeminiResponseParser, TesseractResponseParser
    
    Following Single Responsibility Principle: Only handles response parsing.
    """
    
    @abstractmethod
    def parse_response(self, raw_response: str) -> Dict[str, Any]:
        """
        Parse raw response from AI/OCR service.
        
        Args:
            raw_response: Raw text response
            
        Returns:
            Parsed data as dictionary
            
        Raises:
            ValueError: If parsing fails
        """
        pass
    
    @abstractmethod
    def extract_json(self, text: str) -> str:
        """
        Extract JSON from text (removing markdown, etc.).
        
        Args:
            text: Text containing JSON
            
        Returns:
            Clean JSON string
        """
        pass
    
    @abstractmethod
    def validate_response_structure(self, data: Dict[str, Any]) -> bool:
        """
        Validate that parsed response has required fields.
        
        Args:
            data: Parsed response data
            
        Returns:
            True if structure is valid
        """
        pass


class IDataMapper(ABC):
    """
    Interface for mapping data between different formats.
    Implementations: ReceiptDataMapper
    
    Following Single Responsibility Principle: Only handles data transformation.
    """
    
    @abstractmethod
    def map_to_receipt(self, data: Dict[str, Any]) -> TransactionReceipt:
        """
        Map raw data dictionary to TransactionReceipt model.
        
        Args:
            data: Raw data dictionary
            
        Returns:
            TransactionReceipt object
            
        Raises:
            ValueError: If mapping fails
        """
        pass
    
    @abstractmethod
    def map_from_receipt(self, receipt: TransactionReceipt) -> Dict[str, Any]:
        """
        Map TransactionReceipt to dictionary for storage/transmission.
        
        Args:
            receipt: TransactionReceipt object
            
        Returns:
            Dictionary representation
        """
        pass
