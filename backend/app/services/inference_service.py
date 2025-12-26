from typing import Optional, Tuple
from app.core.banks import get_bank_name, get_bank_code

class BankInferenceService:
    def infer_missing_bank_data(self, bank_code: Optional[str], bank_name: Optional[str]) -> Tuple[Optional[str], Optional[str]]:
        """
        Infers missing bank name or code based on available data.
        Returns (bank_code, bank_name).
        """
        if bank_code and not bank_name:
            inferred = get_bank_name(bank_code)
            if inferred: 
                return bank_code, inferred
        elif bank_name and not bank_code:
            inferred = get_bank_code(bank_name)
            if inferred: 
                return inferred, bank_name
        
        return bank_code, bank_name
