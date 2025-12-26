import re
from dataclasses import dataclass
from typing import Optional


@dataclass
class ParseResult:
    amount: Optional[str] = None
    date: Optional[str] = None
    operation: Optional[str] = None
    identification: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    bankCode: Optional[str] = None
    bankName: Optional[str] = None
    concept: Optional[str] = None


class BaseStrategy:
    name = "default"

    # compile commonly used regexes for reuse. Patterns accept optional labels
    # allow separators after labels: colon, comma, space or hyphen
    SEP = r"[\s:,\-]*"
    # Amount: Require explicit label OR currency (prefix/suffix) OR strict number with decimals
    # This avoids matching standalone years like 2025
    # Group 1: Label + Number
    # Group 2: Prefix + Number
    # Group 3: Number + Suffix
    # Group 4: Number with decimals (standalone)
    re_amount = re.compile(
        r"(?:(?:Monto|Total|Importe)" + SEP + r")((?:\d{1,3}(?:[.,]\d{3})*(?!\d)|\d+)(?:[.,]\d{1,2})?)|"  # Label + Number
        r"(?:Bs\.?|VES|VEF|USD|EUR)\s*((?:\d{1,3}(?:[.,]\d{3})*(?!\d)|\d+)(?:[.,]\d{1,2})?)|"             # Prefix + Number
        r"((?:\d{1,3}(?:[.,]\d{3})*(?!\d)|\d+)(?:[.,]\d{1,2})?)\s*(?:Bs|VES|VEF|USD|EUR)|"                # Number + Suffix
        r"((?:\d{1,3}(?:[.,]\d{3})*(?!\d)|\d+)[.,]\d{1,2})(?![\d-])",                                     # Number w/ Decimals
        re.IGNORECASE
    )
    re_date = re.compile(r"(?:Fecha" + SEP + r")?(\d{2}[\s/-]\d{2}[\s/-]\d{4})", re.IGNORECASE)
    re_operation = re.compile(r"(?:Operaci[oó]n" + SEP + r")?(\b\d{6,14}\b)", re.IGNORECASE)
    # identification accepts CI or RIF-like formats, with optional label
    # prefer labeled identification, otherwise match standalone 7-9 digits not inside longer numbers
    re_identification = re.compile(r"(?:Identificaci[oó]n[:\s]*([VEJPG]-?\d+|\d{7,9}))|(?<!\d)(\d{7,9})(?!\d)", re.IGNORECASE)
    re_origin = re.compile(r"(?:Origen" + SEP + r")?(\d{4}\*+\d{4})", re.IGNORECASE)
    re_destination = re.compile(r"(?:Destino" + SEP + r")?(\b04\d{8,11}\b)", re.IGNORECASE)
    # require explicit 'Banco' label for bankCode to avoid matching years/dates
    re_bankCode = re.compile(r"Banco" + SEP + r"(\d{4})", re.IGNORECASE)
    # common bank names to match and normalize
    re_bankName = re.compile(r"((?:Banco" + SEP + r")?\b(?:Banesco|Mercantil|Provincial|Venezuela|BOD|Bancaribe|Banesco Banco)\b)", re.IGNORECASE)
    re_concept = re.compile(r"(?:Concepto" + SEP + r")?(pago|concepto" + SEP + r"[\w\s]+)", re.IGNORECASE)

    def parse(self, text: str) -> ParseResult:
        return ParseResult(
            amount=self._first(self.re_amount, text),
            date=self._first(self.re_date, text),
            operation=self._first(self.re_operation, text),
            identification=self._first(self.re_identification, text),
            origin=self._first(self.re_origin, text),
            destination=self._first(self.re_destination, text),
            bankCode=self._first(self.re_bankCode, text),
            bankName=self._first(self.re_bankName, text),
            concept=self._first(self.re_concept, text),
        )

    @staticmethod
    def _first(regex, text: str) -> Optional[str]:
        m = regex.search(text)
        if not m:
            return None
        # return the first non-None captured group if any, otherwise the whole match
        groups = m.groups()
        if groups:
            for g in groups:
                if g is not None:
                    return g.strip()
        return m.group(0).strip()
