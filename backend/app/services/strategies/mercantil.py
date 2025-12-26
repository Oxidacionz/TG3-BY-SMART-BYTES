import re
from .base import BaseStrategy, ParseResult

class MercantilStrategy(BaseStrategy):
    name = "Mercantil"
    # override parse to extract bank code when present like '0105 - BANCO MERCANTIL'
    def parse(self, text: str) -> ParseResult:
        res = super().parse(text)
        # try to find pattern '0105 - BANCO MERCANTIL' or '0105 - MERCANTIL'
        m = re.search(r"(\d{4})\s*[-–]\s*(?:BANCO\s+)?([A-ZÁÉÍÓÚÑ\s]+)", text, re.IGNORECASE)
        if m:
            code = m.group(1).strip()
            name = m.group(2).strip()
            # avoid capturing trailing labels on next lines
            name = name.splitlines()[0].strip()
            # normalize bank name upper and ensure it starts with 'BANCO'
            name_upper = name.upper()
            res.bankCode = code
            res.bankName = f"BANCO {name_upper}" if not name_upper.startswith("BANCO") else name_upper
        return res
