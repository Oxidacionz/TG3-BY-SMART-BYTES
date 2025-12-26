import re
from .base import BaseStrategy, ParseResult

class BancamigaStrategy(BaseStrategy):
    name = "Bancamiga"
    
    # Specific patterns for Bancamiga
    # "NUMERO DE REFERENCIA:\n160313816259"
    re_ref = re.compile(r"NUMERO DE REFERENCIA[:\s]*(\d+)", re.IGNORECASE)
    
    # "MONTO DE LA OPERACIÓN:\nBs. 18.750,00"
    # Allow for noise characters between label and value (like 'j' in the debug output)
    re_amt = re.compile(r"MONTO DE LA OPERACI[ÓO]N[:\s\w]*\n\s*((?:Bs\.?|VES)?\s*[\d\.,]+)", re.IGNORECASE)
    
    # "FECHA:\n03/12/25 04:02 pm"
    re_date_lbl = re.compile(r"FECHA[:\s]*\n\s*(\d{2}/\d{2}/\d{2,4})", re.IGNORECASE)
    
    # "BANCO:\nBANCO DE VENEZUELA"
    re_bank_lbl = re.compile(r"BANCO[:\s]*\n\s*([^\n]+)", re.IGNORECASE)

    # "TELF BENEFICIARIO:\n04246032325"
    re_dest_lbl = re.compile(r"TELF(?: BENEFICIARIO)?[:\s]*\n\s*(\d+)", re.IGNORECASE)

    # "CI / RIF BENEFICIARIO:\nV-12787959"
    # Handle garbled "CI" -> "a" or similar
    re_id_lbl = re.compile(r"(?:(?:CI|a|C\.?I\.?)\s*/\s*RIF|IDENTIFICACI[ÓO]N)[:\s\w]*\n\s*([VEJPG]-?\d+|\d{7,9})", re.IGNORECASE)

    # "CONCEPTO:\npago"
    re_concept = re.compile(r"CONCEPTO[:\s]*\n\s*([^\n]+)", re.IGNORECASE)

    def parse(self, text: str) -> ParseResult:
        # Do NOT call super().parse(text)
        res = ParseResult()
        
        # 1. Reference (Operation)
        m_ref = self.re_ref.search(text)
        if m_ref:
            res.operation = m_ref.group(1).strip()
            
        # 2. Amount
        m_amt = self.re_amt.search(text)
        if m_amt:
            res.amount = m_amt.group(1).strip()
            
        # 3. Date
        m_date = self.re_date_lbl.search(text)
        if m_date:
            res.date = m_date.group(1).strip()
            
        # 4. Bank Name
        m_bank = self.re_bank_lbl.search(text)
        if m_bank:
            res.bankName = m_bank.group(1).strip()
            
        # 5. Identification
        m_id = self.re_id_lbl.search(text)
        if m_id:
            res.identification = m_id.group(1).strip()

        # 6. Destination
        m_dest = self.re_dest_lbl.search(text)
        if m_dest:
            res.destination = m_dest.group(1).strip()

        # 7. Concept
        m_concept = self.re_concept.search(text)
        if m_concept:
            res.concept = m_concept.group(1).strip()

        return res
