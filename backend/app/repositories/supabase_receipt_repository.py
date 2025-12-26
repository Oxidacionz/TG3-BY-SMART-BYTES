"""
Supabase repository implementation for receipt persistence.
Implements IReceiptRepository interface using Supabase client.

Following Repository Pattern: Abstracts data access logic.
"""
from typing import Optional, List
from datetime import datetime
import os

from app.core.interfaces import IReceiptRepository
from app.schemas.receipt import TransactionReceipt
from app.services.data_mapper import receipt_mapper
from app.core.logger import get_logger

logger = get_logger(__name__)


class SupabaseReceiptRepository(IReceiptRepository):
    """
    Supabase implementation of receipt repository.
    Uses Supabase Python client for database operations.
    """
    
    def __init__(self):
        """Initialize Supabase repository."""
        try:
            from supabase import create_client, Client
            
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_key = os.getenv("SUPABASE_KEY")
            
            if not supabase_url or not supabase_key:
                raise ValueError(
                    "SUPABASE_URL and SUPABASE_KEY must be set in environment variables"
                )
            
            self.client: Client = create_client(supabase_url, supabase_key)
            self.table_name = "transactions"
            
            logger.info("SupabaseReceiptRepository initialized")
            
        except ImportError:
            logger.error("Supabase client not installed. Install with: pip install supabase")
            raise
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            raise
    
    async def save_receipt(
        self,
        receipt: TransactionReceipt,
        user_id: Optional[str] = None
    ) -> str:
        """
        Save a transaction receipt to Supabase.
        
        Args:
            receipt: TransactionReceipt to save
            user_id: Optional user ID
            
        Returns:
            ID of the saved receipt
            
        Raises:
            Exception: If save operation fails
        """
        try:
            # Convert receipt to dictionary
            receipt_dict = receipt_mapper.map_from_receipt(receipt)
            
            # Prepare data for Supabase
            data = {
                "user_id": user_id,
                "platform": receipt_dict["platform"],
                "amount": receipt_dict["amount"],
                "currency": receipt_dict["currency"],
                "reference_id": receipt_dict.get("reference_id"),
                "transaction_date": receipt_dict.get("transaction_date"),
                "sender_name": receipt_dict.get("sender_name"),
                "receiver_name": receipt_dict.get("receiver_name"),
                "raw_text_snippet": receipt_dict.get("raw_text_snippet")
            }
            
            # Insert into Supabase
            result = self.client.table(self.table_name).insert(data).execute()
            
            if not result.data:
                raise Exception("Supabase insert returned no data")
            
            receipt_id = result.data[0]["id"]
            logger.info(f"Receipt saved to Supabase: {receipt_id}")
            
            return receipt_id
            
        except Exception as e:
            logger.error(f"Error saving receipt to Supabase: {e}")
            raise Exception(f"Supabase error: {str(e)}")
    
    async def get_receipt(self, receipt_id: str) -> Optional[TransactionReceipt]:
        """
        Retrieve a receipt by ID from Supabase.
        
        Args:
            receipt_id: Unique identifier
            
        Returns:
            TransactionReceipt if found, None otherwise
        """
        try:
            result = self.client.table(self.table_name).select("*").eq(
                "id", receipt_id
            ).execute()
            
            if not result.data:
                return None
            
            # Convert to TransactionReceipt
            receipt_dict = result.data[0]
            return receipt_mapper.map_to_receipt(receipt_dict)
            
        except Exception as e:
            logger.error(f"Error retrieving receipt from Supabase: {e}")
            return None
    
    async def get_receipts_by_user(
        self,
        user_id: str,
        limit: int = 100,
        offset: int = 0
    ) -> List[TransactionReceipt]:
        """
        Get all receipts for a specific user from Supabase.
        
        Args:
            user_id: User identifier
            limit: Maximum number of receipts
            offset: Number to skip
            
        Returns:
            List of TransactionReceipt objects
        """
        try:
            result = self.client.table(self.table_name).select("*").eq(
                "user_id", user_id
            ).order(
                "created_at", desc=True
            ).limit(limit).offset(offset).execute()
            
            if not result.data:
                return []
            
            # Convert to TransactionReceipt list
            receipts = []
            for receipt_dict in result.data:
                receipts.append(receipt_mapper.map_to_receipt(receipt_dict))
            
            return receipts
            
        except Exception as e:
            logger.error(f"Error retrieving user receipts from Supabase: {e}")
            return []
    
    async def get_receipts_by_date_range(
        self,
        start_date: datetime,
        end_date: datetime,
        user_id: Optional[str] = None
    ) -> List[TransactionReceipt]:
        """
        Get receipts within a date range from Supabase.
        
        Args:
            start_date: Start of range
            end_date: End of range
            user_id: Optional user filter
            
        Returns:
            List of TransactionReceipt objects
        """
        try:
            query = self.client.table(self.table_name).select("*").gte(
                "transaction_date", start_date.isoformat()
            ).lte(
                "transaction_date", end_date.isoformat()
            )
            
            if user_id:
                query = query.eq("user_id", user_id)
            
            result = query.order("transaction_date", desc=True).execute()
            
            if not result.data:
                return []
            
            # Convert to TransactionReceipt list
            receipts = []
            for receipt_dict in result.data:
                receipts.append(receipt_mapper.map_to_receipt(receipt_dict))
            
            return receipts
            
        except Exception as e:
            logger.error(f"Error retrieving receipts by date from Supabase: {e}")
            return []
    
    async def delete_receipt(self, receipt_id: str) -> bool:
        """
        Delete a receipt by ID from Supabase.
        
        Args:
            receipt_id: Unique identifier
            
        Returns:
            True if deleted successfully
        """
        try:
            result = self.client.table(self.table_name).delete().eq(
                "id", receipt_id
            ).execute()
            
            if result.data:
                logger.info(f"Receipt deleted from Supabase: {receipt_id}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error deleting receipt from Supabase: {e}")
            return False
