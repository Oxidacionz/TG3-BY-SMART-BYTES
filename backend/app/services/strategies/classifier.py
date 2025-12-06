from enum import Enum
import re
import unicodedata
from typing import Tuple, Optional

class Bank(Enum):
    VENEZUELA = "VENEZUELA"
    BANESCO = "BANESCO"
    MERCANTIL = "MERCANTIL"
    BANCAMIGA = "BANCAMIGA"
    UNKNOWN = "UNKNOWN"

class TransactionType(Enum):
    MOBILE_PAYMENT = "MOBILE_PAYMENT"
    TRANSFER = "TRANSFER"
    UNKNOWN = "UNKNOWN"

class TransactionClassifier:
    @staticmethod
    def classify(text: str) -> Tuple[Bank, TransactionType]:
        """
        Analyzes text to determine the Bank and Transaction Type.
        """
        if not text:
            return Bank.UNKNOWN, TransactionType.UNKNOWN

        # Normalize text for easier matching
        norm = TransactionClassifier._normalize(text)
        
        # 1. Determine Bank
        bank = Bank.UNKNOWN
        # Prioritize strong signals like "PagomóvilBDV" to avoid false positives from destination banks
        if "pagomovilbdv" in norm or "pago movil bdv" in norm:
            bank = Bank.VENEZUELA
        elif "bancamiga" in norm:
            bank = Bank.BANCAMIGA
        elif "banesco" in norm:
            bank = Bank.BANESCO
        elif "mercantil" in norm:
            bank = Bank.MERCANTIL
        elif "venezuela" in norm or "bdv" in norm:
            bank = Bank.VENEZUELA
            
        # 2. Determine Transaction Type
        transaction_type = TransactionClassifier._identify_transaction_type(norm)
        

        return bank, transaction_type

    @staticmethod
    def _identify_transaction_type(normalized_text: str) -> TransactionType:
        # Default to MOBILE_PAYMENT for now as it's the primary use case
        # Logic can be expanded later to detect "Transferencia" keywords
        tx_type = TransactionType.MOBILE_PAYMENT
        
        if "transferencia" in normalized_text:
            tx_type = TransactionType.TRANSFER
        return tx_type

    @staticmethod
    def _normalize(text: str) -> str:
        # remove accents, lower, remove punctuation and collapse spaces
        nf = unicodedata.normalize('NFD', text)
        no_accents = ''.join(c for c in nf if not unicodedata.combining(c)).lower()
        # replace any non-alphanumeric character with space
        cleaned = re.sub(r"[^a-z0-9]", " ", no_accents)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        return cleaned
