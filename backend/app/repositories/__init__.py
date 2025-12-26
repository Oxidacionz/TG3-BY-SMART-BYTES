"""
Repository factory and dependency injection.
Creates appropriate repository instances based on configuration.

Following Factory Pattern and Dependency Inversion Principle.
"""
from typing import Optional
from app.core.interfaces import IReceiptRepository
from app.core.logger import get_logger
from app.core.config import settings

logger = get_logger(__name__)


class RepositoryFactory:
    """
    Factory for creating repository instances.
    Enables easy switching between SQLite and Supabase.
    """
    
    _instance: Optional[IReceiptRepository] = None
    
    @staticmethod
    def create_repository(db_type: Optional[str] = None) -> IReceiptRepository:
        """
        Create a repository instance based on database type.
        
        Args:
            db_type: Database type ("sqlite" or "supabase")
                    Defaults to settings.DATABASE_TYPE
        
        Returns:
            IReceiptRepository implementation
            
        Raises:
            ValueError: If database type is not supported
        """
        db_type = db_type or getattr(settings, 'DATABASE_TYPE', 'sqlite')
        db_type = db_type.lower()
        
        # Return cached instance if exists and type matches
        if RepositoryFactory._instance:
            logger.debug(f"Returning cached repository instance: {db_type}")
            return RepositoryFactory._instance
        
        # Create new instance
        if db_type == "sqlite":
            from app.repositories.sqlite_receipt_repository import SQLiteReceiptRepository
            repository = SQLiteReceiptRepository()
        elif db_type == "supabase":
            from app.repositories.supabase_receipt_repository import SupabaseReceiptRepository
            repository = SupabaseReceiptRepository()
        else:
            raise ValueError(
                f"Unsupported database type: {db_type}. "
                f"Supported types: sqlite, supabase"
            )
        
        # Cache the instance
        RepositoryFactory._instance = repository
        logger.info(f"Created new repository instance: {db_type}")
        
        return repository
    
    @staticmethod
    def clear_cache():
        """Clear cached repository instance."""
        RepositoryFactory._instance = None
        logger.info("Repository cache cleared")


# Convenience function for dependency injection
def get_receipt_repository() -> IReceiptRepository:
    """
    Get the default receipt repository based on configuration.
    
    Returns:
        IReceiptRepository implementation
    """
    return RepositoryFactory.create_repository()
