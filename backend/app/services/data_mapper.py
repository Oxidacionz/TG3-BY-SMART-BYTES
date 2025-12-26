"""
Data mapping services implementing IDataMapper interface.
Handles transformation between different data formats.

Following Single Responsibility Principle: Only maps data.
"""
from decimal import Decimal
from typing import Dict, Any, Optional
from datetime import datetime
from app.core.interfaces import IDataMapper
from app.schemas.receipt import TransactionReceipt, FinancialPlatform, Currency
from app.core.logger import get_logger

logger = get_logger(__name__)


class ReceiptDataMapper(IDataMapper):
    """
    Maps between raw data dictionaries and TransactionReceipt models.
    Handles type conversion, validation, and normalization.
    """
    
    def map_to_receipt(self, data: Dict[str, Any]) -> TransactionReceipt:
        """
        Map raw data dictionary to TransactionReceipt model.
        
        Args:
            data: Raw data from AI/OCR service
            
        Returns:
            TransactionReceipt object
            
        Raises:
            ValueError: If mapping fails due to invalid data
        """
        try:
            # Map platform
            platform = self._map_platform(data.get("platform"))
            
            # Map currency
            currency = self._map_currency(data.get("currency", "VES"))
            
            # Map amount
            amount = self._map_amount(data.get("amount"))
            
            # Map optional datetime
            transaction_date = self._map_datetime(data.get("transaction_date"))
            
            # Build receipt
            receipt = TransactionReceipt(
                platform=platform,
                amount=amount,
                currency=currency,
                reference_id=data.get("reference_id"),
                transaction_date=transaction_date,
                sender_name=data.get("sender_name"),
                receiver_name=data.get("receiver_name"),
                # New fields for enhanced extraction
                sender_doc_id=data.get("sender_doc_id"),
                receiver_doc_id=data.get("receiver_doc_id"),
                sender_bank=data.get("sender_bank"),
                receiver_bank=data.get("receiver_bank"),
                requires_manual_review=data.get("requires_manual_review", False),
                manual_review_reason=data.get("manual_review_reason"),
                raw_text_snippet=self._truncate_text(data.get("raw_text_snippet", ""), 200)
            )
            
            logger.info(f"Mapped receipt: {platform.value}, {amount} {currency.value}")
            return receipt
            
        except Exception as e:
            logger.error(f"Error mapping data to receipt: {e}")
            raise ValueError(f"Failed to map data to TransactionReceipt: {str(e)}")
    
    def map_from_receipt(self, receipt: TransactionReceipt) -> Dict[str, Any]:
        """
        Map TransactionReceipt to dictionary for storage/transmission.
        
        Args:
            receipt: TransactionReceipt object
            
        Returns:
            Dictionary representation
        """
        return {
            "platform": receipt.platform.value,
            "amount": float(receipt.amount),
            "currency": receipt.currency.value,
            "reference_id": receipt.reference_id,
            "transaction_date": receipt.transaction_date.isoformat() if receipt.transaction_date else None,
            "sender_name": receipt.sender_name,
            "receiver_name": receipt.receiver_name,
            # New fields
            "sender_doc_id": receipt.sender_doc_id,
            "receiver_doc_id": receipt.receiver_doc_id,
            "sender_bank": receipt.sender_bank,
            "receiver_bank": receipt.receiver_bank,
            "requires_manual_review": receipt.requires_manual_review,
            "manual_review_reason": receipt.manual_review_reason,
            "raw_text_snippet": receipt.raw_text_snippet
        }
    
    def _map_platform(self, platform_str: Optional[str]) -> FinancialPlatform:
        """
        Map platform string to FinancialPlatform enum.
        
        Args:
            platform_str: Platform string from data
            
        Returns:
            FinancialPlatform enum value
        """
        if not platform_str:
            return FinancialPlatform.UNKNOWN
        
        # Try exact match first
        try:
            return FinancialPlatform(platform_str)
        except ValueError:
            pass
        
        # Fuzzy matching for common variations
        normalized = platform_str.upper()
        
        platform_mapping = {
            "BANESCO": FinancialPlatform.BANESCO_VE,
            "MERCANTIL": FinancialPlatform.MERCANTIL_VE,
            "VENEZUELA": FinancialPlatform.BDV,
            "BDV": FinancialPlatform.BDV,
            "PROVINCIAL": FinancialPlatform.PROVINCIAL,
            "PAGO MOVIL": FinancialPlatform.PAGO_MOVIL,
            "PAGO_MOVIL": FinancialPlatform.PAGO_MOVIL,
            "BOA": FinancialPlatform.BOA,
            "BANK OF AMERICA": FinancialPlatform.BOA,
            "WELLS FARGO": FinancialPlatform.WELLS_FARGO,
            "CHASE": FinancialPlatform.CHASE,
            "ZELLE": FinancialPlatform.ZELLE,
            "BINANCE": FinancialPlatform.BINANCE,
            "PAYPAL": FinancialPlatform.PAYPAL,
            "WALLY": FinancialPlatform.WALLY,
            "ZINLI": FinancialPlatform.ZINLI
        }
        
        for key, platform in platform_mapping.items():
            if key in normalized:
                return platform
        
        logger.warning(f"Unknown platform: {platform_str}, defaulting to UNKNOWN")
        return FinancialPlatform.UNKNOWN
    
    def _map_currency(self, currency_str: Optional[str]) -> Currency:
        """
        Map currency string to Currency enum.
        
        Args:
            currency_str: Currency string from data
            
        Returns:
            Currency enum value
        """
        if not currency_str:
            return Currency.VES  # Default
        
        # Try exact match
        try:
            return Currency(currency_str)
        except ValueError:
            pass
        
        # Fuzzy matching
        normalized = currency_str.upper()
        
        if "USD" in normalized or "$" in normalized:
            return Currency.USD
        elif "BS" in normalized or "VES" in normalized or "BOLIVAR" in normalized:
            return Currency.VES
        elif "EUR" in normalized or "€" in normalized:
            return Currency.EUR
        elif "USDT" in normalized or "TETHER" in normalized:
            return Currency.USDT
        
        logger.warning(f"Unknown currency: {currency_str}, defaulting to VES")
        return Currency.VES
    
    def _map_amount(self, amount_value: Any) -> Decimal:
        """
        Map amount value to Decimal.
        
        Args:
            amount_value: Amount from data (can be str, int, float, Decimal)
            
        Returns:
            Decimal amount
            
        Raises:
            ValueError: If amount cannot be converted
        """
        if amount_value is None:
            logger.warning("Amount is None, defaulting to 0.00")
            return Decimal("0.00")
        
        try:
            # Handle string amounts (may have commas, currency symbols)
            if isinstance(amount_value, str):
                # Remove common formatting
                cleaned = amount_value.replace(",", "").replace("$", "").replace("Bs", "").strip()
                return Decimal(cleaned)
            
            # Convert to string first to avoid float precision issues
            return Decimal(str(amount_value))
            
        except (ValueError, TypeError) as e:
            logger.error(f"Failed to convert amount: {amount_value}, error: {e}")
            raise ValueError(f"Invalid amount value: {amount_value}")
    
    def _map_datetime(self, date_value: Any) -> Optional[datetime]:
        """
        Map date value to datetime object.
        
        Args:
            date_value: Date from data (can be str, datetime, None)
            
        Returns:
            datetime object or None
        """
        if date_value is None:
            return None
        
        if isinstance(date_value, datetime):
            return date_value
        
        if isinstance(date_value, str):
            # Try common date formats
            formats = [
                "%Y-%m-%d %H:%M:%S",
                "%Y-%m-%dT%H:%M:%S",
                "%Y-%m-%d",
                "%d/%m/%Y %H:%M:%S",
                "%d/%m/%Y",
                "%d-%m-%Y %H:%M:%S",
                "%d-%m-%Y"
            ]
            
            for fmt in formats:
                try:
                    return datetime.strptime(date_value, fmt)
                except ValueError:
                    continue
            
            logger.warning(f"Could not parse date: {date_value}")
        
        return None
    
    def _truncate_text(self, text: str, max_length: int) -> str:
        """
        Truncate text to maximum length.
        
        Args:
            text: Text to truncate
            max_length: Maximum length
            
        Returns:
            Truncated text
        """
        if not text:
            return ""
        
        if len(text) <= max_length:
            return text
        
        return text[:max_length] + "..."


# Singleton instance
receipt_mapper = ReceiptDataMapper()
