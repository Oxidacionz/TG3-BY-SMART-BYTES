"""
Scanner Factory implementing Factory Pattern.
Creates appropriate scanner instances based on configuration.

Following Open/Closed Principle: Easy to add new scanner types without modifying existing code.
"""
from typing import Optional
from app.core.interfaces import IImageProcessor
from app.services.gemini_scanner import GeminiScannerService
from app.core.logger import get_logger
from app.core.config import settings

logger = get_logger(__name__)


class ScannerFactory:
    """
    Factory for creating scanner service instances.
    Enables easy switching between different scanner providers.
    """
    
    _instances = {}  # Cache for singleton instances
    
    @staticmethod
    def create_scanner(provider: Optional[str] = None) -> IImageProcessor:
        """
        Create a scanner instance based on provider name.
        
        Args:
            provider: Scanner provider name ("gemini", "tesseract", etc.)
                     Defaults to settings.SCANNER_PROVIDER
        
        Returns:
            IImageProcessor implementation
            
        Raises:
            ValueError: If provider is not supported
        """
        provider = provider or getattr(settings, 'SCANNER_PROVIDER', 'gemini')
        provider = provider.lower()
        
        # Return cached instance if exists
        if provider in ScannerFactory._instances:
            logger.debug(f"Returning cached scanner instance: {provider}")
            return ScannerFactory._instances[provider]
        
        # Create new instance based on provider
        scanner = ScannerFactory._create_new_scanner(provider)
        
        # Cache the instance
        ScannerFactory._instances[provider] = scanner
        
        logger.info(f"Created new scanner instance: {provider}")
        return scanner
    
    @staticmethod
    def _create_new_scanner(provider: str) -> IImageProcessor:
        """
        Create a new scanner instance.
        
        Args:
            provider: Scanner provider name
            
        Returns:
            IImageProcessor implementation
            
        Raises:
            ValueError: If provider is not supported
        """
        if provider == "gemini":
            return GeminiScannerService()
        
        elif provider == "tesseract":
            # Import here to avoid circular dependencies
            try:
                from app.services.ocr_service import TesseractService
                from app.services.parser_service import ReceiptParser
                
                # Wrap Tesseract in an adapter if needed
                # For now, we'll raise NotImplementedError
                raise NotImplementedError(
                    "Tesseract scanner not yet refactored to implement IImageProcessor"
                )
            except ImportError:
                raise ValueError("Tesseract dependencies not available")
        
        else:
            raise ValueError(
                f"Unsupported scanner provider: {provider}. "
                f"Supported providers: gemini, tesseract"
            )
    
    @staticmethod
    def clear_cache():
        """Clear cached scanner instances."""
        ScannerFactory._instances.clear()
        logger.info("Scanner cache cleared")
    
    @staticmethod
    def get_available_providers() -> list[str]:
        """
        Get list of available scanner providers.
        
        Returns:
            List of provider names
        """
        return ["gemini", "tesseract"]


# Convenience function for getting default scanner
def get_default_scanner() -> IImageProcessor:
    """
    Get the default scanner instance based on configuration.
    
    Returns:
        IImageProcessor implementation
    """
    return ScannerFactory.create_scanner()
