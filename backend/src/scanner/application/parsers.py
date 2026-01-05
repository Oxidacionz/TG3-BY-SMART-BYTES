from typing import Dict, Any
import json
from src.shared.config.logger import logger
from src.transactions.domain.transaction import (
    Transaction, 
    FinancialPlatform, 
    Currency,
    TransactionType,
    TransactionCategory,
    TransactionStatus
)

class GeminiResponseParser:
    def parse(self, raw_response: str) -> Dict[str, Any]:
        """
        Parses the raw text response from Gemini into a dictionary.
        Handles markdown code blocks and basic JSON cleanup.
        """
        try:
            # Remove Markdown formatting
            clean_text = raw_response.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.startswith("```"):
                clean_text = clean_text[3:] 
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            
            clean_text = clean_text.strip()
            
            return json.loads(clean_text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}. Raw: {raw_response[:100]}...")
            raise ValueError("Invalid JSON response from AI")

class ReceiptDataMapper:
    def _normalize_platform(self, raw_platform: str) -> FinancialPlatform:
        if not raw_platform:
            return FinancialPlatform.UNKNOWN
            
        raw = raw_platform.upper().replace(" ", "_").replace("-", "_")
        
        # Mapping Rules
        if "BANESCO" in raw: return FinancialPlatform.BANESCO_VE
        if "MERCANTIL" in raw: return FinancialPlatform.MERCANTIL_VE
        if "VENEZUELA" in raw or "BDV" in raw: return FinancialPlatform.BDV
        if "PROVINCIAL" in raw or "BBVA" in raw: return FinancialPlatform.PROVINCIAL
        if "BINANCE" in raw: return FinancialPlatform.BINANCE
        if "ZELLE" in raw: return FinancialPlatform.ZELLE
        if "BOFA" in raw or "AMERICA" in raw: return FinancialPlatform.BOA
        if "PAYPAL" in raw: return FinancialPlatform.PAYPAL
        if "ZINLI" in raw: return FinancialPlatform.ZINLI
        if "WALLY" in raw: return FinancialPlatform.WALLY
        
        try:
            return FinancialPlatform(raw)
        except ValueError:
            return FinancialPlatform.UNKNOWN

    def to_domain(self, raw_data: Dict[str, Any]) -> Transaction:
        """
        Maps raw dictionary to Transaction domain model.
        Performs normalization of fields.
        """
        
        # Normalize Platform
        platform_raw = raw_data.get("platform", "UNKNOWN")
        platform = self._normalize_platform(str(platform_raw))
        
        # Normalize Amount
        amount = raw_data.get("amount", 0.0)
        if isinstance(amount, str):
            try:
                # Handle "1.234,56" format if generic logic failed
                clean_amount = amount.replace(".", "").replace(",", ".")
                amount = float(clean_amount)
            except:
                amount = 0.0

        # Normalize Transaction Type
        raw_type = raw_data.get("transaction_type", "NEUTRO")
        try:
            tx_type = TransactionType(raw_type)
        except ValueError:
            tx_type = TransactionType.NEUTRO # Fallback

        # Normalize Category
        raw_cat = raw_data.get("category", "OTROS")
        try:
            category = TransactionCategory(raw_cat)
        except ValueError:
            category = TransactionCategory.OTROS

        # Normalize Status (Debt Logic)
        payment_status = raw_data.get("payment_status", "COMPLETO")
        status = TransactionStatus.PENDING # Default

        if payment_status == "COMPLETO":
            status = TransactionStatus.COMPLETED
        elif payment_status == "DEUDA_POR_PAGAR":
            status = TransactionStatus.PENDING_DELIVERY # We owe money/goods
        elif payment_status == "DEUDA_POR_COBRAR":
            status = TransactionStatus.ACCOUNTS_RECEIVABLE # They owe us
        
        # Partial Flag to Description
        description = raw_data.get("description", "")
        if raw_data.get("is_partial"):
            description = f"[PARCIAL] {description}"

        return Transaction(
            platform=platform,
            amount=float(amount),
            currency=raw_data.get("currency", Currency.VES),
            reference_id=raw_data.get("reference_number") or raw_data.get("reference_id"), # Prompt updated to reference_number but fallback
            transaction_date=raw_data.get("transaction_date"),
            sender_name=raw_data.get("sender_name"),
            receiver_name=raw_data.get("receiver_name"),
            raw_text=raw_data.get("raw_text_snippet"),
            
            # New Mapped Fields
            transaction_type=tx_type,
            category=category,
            status=status,
            description=description,
            exchange_rate=raw_data.get("exchange_rate") or 1.0
        )
