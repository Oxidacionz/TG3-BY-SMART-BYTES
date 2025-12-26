"""
SQLite repository implementation for receipt persistence.
Implements IReceiptRepository interface using SQLAlchemy.

Following Repository Pattern: Abstracts data access logic.
"""
from typing import Optional, List
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError
import os

from app.core.interfaces import IReceiptRepository
from app.schemas.receipt import TransactionReceipt
from app.models.transaction import Transaction, Base
from app.services.data_mapper import receipt_mapper
from app.core.logger import get_logger

logger = get_logger(__name__)


class SQLiteReceiptRepository(IReceiptRepository):
    """
    SQLite implementation of receipt repository.
    Uses SQLAlchemy for database operations.
    """
    
    def __init__(self, database_url: Optional[str] = None):
        """
        Initialize SQLite repository.
        
        Args:
            database_url: SQLite database URL (defaults to env var or local file)
        """
        self.database_url = database_url or os.getenv(
            "DATABASE_URL",
            "sqlite:///./transactions.db"
        )
        
        # Create engine
        self.engine = create_engine(
            self.database_url,
            connect_args={"check_same_thread": False}  # For SQLite
        )
        
        # Create tables
        Base.metadata.create_all(bind=self.engine)
        
        # Create session factory
        self.SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine
        )
        
        logger.info(f"SQLiteReceiptRepository initialized with database: {self.database_url}")
    
    def _get_session(self) -> Session:
        """Get a new database session."""
        return self.SessionLocal()
    
    async def save_receipt(
        self,
        receipt: TransactionReceipt,
        user_id: Optional[str] = None
    ) -> str:
        """
        Save a transaction receipt to SQLite.
        
        Args:
            receipt: TransactionReceipt to save
            user_id: Optional user ID
            
        Returns:
            ID of the saved receipt
            
        Raises:
            Exception: If save operation fails
        """
        session = self._get_session()
        try:
            # Convert receipt to dictionary
            receipt_dict = receipt_mapper.map_from_receipt(receipt)
            
            # Create transaction model
            transaction = Transaction(
                user_id=user_id,
                platform=receipt_dict["platform"],
                amount=receipt_dict["amount"],
                currency=receipt_dict["currency"],
                reference_id=receipt_dict.get("reference_id"),
                transaction_date=datetime.fromisoformat(receipt_dict["transaction_date"]) 
                    if receipt_dict.get("transaction_date") else None,
                sender_name=receipt_dict.get("sender_name"),
                receiver_name=receipt_dict.get("receiver_name"),
                raw_text_snippet=receipt_dict.get("raw_text_snippet")
            )
            
            # Save to database
            session.add(transaction)
            session.commit()
            session.refresh(transaction)
            
            logger.info(f"Receipt saved to SQLite: {transaction.id}")
            return transaction.id
            
        except SQLAlchemyError as e:
            session.rollback()
            logger.error(f"Error saving receipt to SQLite: {e}")
            raise Exception(f"Database error: {str(e)}")
        finally:
            session.close()
    
    async def get_receipt(self, receipt_id: str) -> Optional[TransactionReceipt]:
        """
        Retrieve a receipt by ID from SQLite.
        
        Args:
            receipt_id: Unique identifier
            
        Returns:
            TransactionReceipt if found, None otherwise
        """
        session = self._get_session()
        try:
            transaction = session.query(Transaction).filter(
                Transaction.id == receipt_id
            ).first()
            
            if not transaction:
                return None
            
            # Convert to TransactionReceipt
            receipt_dict = transaction.to_dict()
            return receipt_mapper.map_to_receipt(receipt_dict)
            
        except SQLAlchemyError as e:
            logger.error(f"Error retrieving receipt from SQLite: {e}")
            return None
        finally:
            session.close()
    
    async def get_receipts_by_user(
        self,
        user_id: str,
        limit: int = 100,
        offset: int = 0
    ) -> List[TransactionReceipt]:
        """
        Get all receipts for a specific user from SQLite.
        
        Args:
            user_id: User identifier
            limit: Maximum number of receipts
            offset: Number to skip
            
        Returns:
            List of TransactionReceipt objects
        """
        session = self._get_session()
        try:
            transactions = session.query(Transaction).filter(
                Transaction.user_id == user_id
            ).order_by(
                Transaction.created_at.desc()
            ).limit(limit).offset(offset).all()
            
            # Convert to TransactionReceipt list
            receipts = []
            for transaction in transactions:
                receipt_dict = transaction.to_dict()
                receipts.append(receipt_mapper.map_to_receipt(receipt_dict))
            
            return receipts
            
        except SQLAlchemyError as e:
            logger.error(f"Error retrieving user receipts from SQLite: {e}")
            return []
        finally:
            session.close()
    
    async def get_receipts_by_date_range(
        self,
        start_date: datetime,
        end_date: datetime,
        user_id: Optional[str] = None
    ) -> List[TransactionReceipt]:
        """
        Get receipts within a date range from SQLite.
        
        Args:
            start_date: Start of range
            end_date: End of range
            user_id: Optional user filter
            
        Returns:
            List of TransactionReceipt objects
        """
        session = self._get_session()
        try:
            query = session.query(Transaction).filter(
                Transaction.transaction_date >= start_date,
                Transaction.transaction_date <= end_date
            )
            
            if user_id:
                query = query.filter(Transaction.user_id == user_id)
            
            transactions = query.order_by(
                Transaction.transaction_date.desc()
            ).all()
            
            # Convert to TransactionReceipt list
            receipts = []
            for transaction in transactions:
                receipt_dict = transaction.to_dict()
                receipts.append(receipt_mapper.map_to_receipt(receipt_dict))
            
            return receipts
            
        except SQLAlchemyError as e:
            logger.error(f"Error retrieving receipts by date from SQLite: {e}")
            return []
        finally:
            session.close()
    
    async def delete_receipt(self, receipt_id: str) -> bool:
        """
        Delete a receipt by ID from SQLite.
        
        Args:
            receipt_id: Unique identifier
            
        Returns:
            True if deleted successfully
        """
        session = self._get_session()
        try:
            transaction = session.query(Transaction).filter(
                Transaction.id == receipt_id
            ).first()
            
            if not transaction:
                return False
            
            session.delete(transaction)
            session.commit()
            
            logger.info(f"Receipt deleted from SQLite: {receipt_id}")
            return True
            
        except SQLAlchemyError as e:
            session.rollback()
            logger.error(f"Error deleting receipt from SQLite: {e}")
            return False
        finally:
            session.close()
