"""
Dependency injection functions for the application.
Provides instances of services and repositories based on configuration.

Following Dependency Inversion Principle.
"""
from app.core.interfaces import IImageProcessor, IReceiptRepository
from app.services.scanner_factory import ScannerFactory
from app.repositories import RepositoryFactory


def get_scanner_service() -> IImageProcessor:
    """
    Dependency injection for scanner service.
    
    Returns:
        IImageProcessor implementation based on configuration
    """
    return ScannerFactory.create_scanner()


def get_receipt_repository() -> IReceiptRepository:
    """
    Dependency injection for receipt repository.
    
    Returns:
        IReceiptRepository implementation based on configuration
    """
    return RepositoryFactory.create_repository()
