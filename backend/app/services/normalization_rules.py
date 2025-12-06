import re
from typing import Dict, Any
from app.services.interfaces import INormalizationRule

class DateNormalizationRule(INormalizationRule):
    def apply(self, data: Dict[str, Any]) -> None:
        if data.get("date"):
            data["date"] = self._normalize_date(data["date"])

    def _normalize_date(self, date_str: str) -> str:
        """
        Converts dd/mm/yy to dd/mm/yyyy.
        Assumes 20xx for 2-digit years.
        """
        match = re.match(r"^(\d{1,2})[/-](\d{1,2})[/-](\d{2})$", date_str.strip())
        if match:
            day, month, year = match.groups()
            return f"{day.zfill(2)}/{month.zfill(2)}/20{year}"
        return date_str

class IdentificationNormalizationRule(INormalizationRule):
    def apply(self, data: Dict[str, Any]) -> None:
        if data.get("identification"):
            data["identification"] = self._normalize_identification(data["identification"])

    def _normalize_identification(self, ident: str) -> str:
        """
        Removes non-numeric characters from identification.
        """
        return re.sub(r"\D", "", ident)

class AmountNormalizationRule(INormalizationRule):
    def apply(self, data: Dict[str, Any]) -> None:
        if data.get("amount"):
            data["amount"] = self._normalize_amount(data["amount"])

    def _normalize_amount(self, amount: str) -> str:
        """
        Removes currency symbols and text from amount string.
        """
        cleaned = re.sub(r"[A-Za-z\s]", "", amount)
        cleaned = cleaned.strip(".,")
        return cleaned

class BankNameNormalizationRule(INormalizationRule):
    def apply(self, data: Dict[str, Any]) -> None:
        if data.get("bankName"):
            data["bankName"] = self._normalize_bank_name(data["bankName"])
        # Also try to normalize from bankCode if bankName is missing
        elif data.get("bankCode"):
             from app.core.banks import get_bank_name
             name = get_bank_name(data["bankCode"])
             if name:
                 data["bankName"] = name

    def _normalize_bank_name(self, name: str) -> str:
        from app.core.banks import get_bank_code, get_bank_name
        # Try to infer code from name, then get official name from code
        code = get_bank_code(name)
        if code:
            official_name = get_bank_name(code)
            if official_name:
                return official_name
        return name

class ConceptNormalizationRule(INormalizationRule):
    def apply(self, data: Dict[str, Any]) -> None:
        if data.get("concept"):
            data["concept"] = self._normalize_concept(data["concept"])

    def _normalize_concept(self, concept: str) -> str:
        """
        Capitalizes the first letter and truncates to 30 characters.
        """
        if not concept:
            return concept
        
        # "concept always starts with uppercase" and "rest lowercase" -> capitalize()
        
        concept = concept.strip()
        if not concept:
            return concept

        normalized = concept.capitalize()
        return normalized[:30]
