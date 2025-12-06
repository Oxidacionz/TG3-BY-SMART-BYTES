import re
from .base import BaseStrategy, ParseResult

class BancoVenezuelaStrategy(BaseStrategy):
    name = "Banco de Venezuela"
    # Banco de Venezuela receipts often include explicit labels like 'Fecha:', 'Identificación:', etc.
    re_bv_origin = re.compile(r"Origen" + BaseStrategy.SEP + r"(\d{4}\*+\d{4})", re.IGNORECASE)
    re_bv_ident = re.compile(r"Identificaci[oó]n" + BaseStrategy.SEP + r"([VEJPG]-?\d+|\d{7,9})", re.IGNORECASE)
    re_bv_bank = re.compile(r"Banco" + BaseStrategy.SEP + r"(\d{4})", re.IGNORECASE)

    def parse(self, text: str) -> ParseResult:
        res = super().parse(text)
        # try bank-specific labeled patterns
        m_ident = self.re_bv_ident.search(text)
        if m_ident:
            res.identification = m_ident.group(1).strip()
        m_org = self.re_bv_origin.search(text)
        if m_org:
            res.origin = m_org.group(1).strip()
        m_bank = self.re_bv_bank.search(text)
        if m_bank:
            res.bankCode = m_bank.group(1).strip()
        return res
