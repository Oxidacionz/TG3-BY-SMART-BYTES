import re
from typing import List
from app.services.fallbacks.base import FallbackExtractor
from app.schemas.ocr_result import OCRResult
from app.utils.normalizer import parse_amount, normalize_amount_to_numeric, clean_bank_name, clean_concept, parse_date_from_text

class BankNameFallback(FallbackExtractor):
    def extract(self, text: str, current_result: OCRResult) -> None:
        if not current_result.bankName:
            m = re.search(r"BANCO\s+([A-ZÁÉÍÓÚÑ]+)", text, re.IGNORECASE)
            if m:
                current_result.bankName = m.group(0)
        
        # Normalize if present
        if current_result.bankName:
            current_result.bankName = clean_bank_name(current_result.bankName)

class BankCodeFallback(FallbackExtractor):
    def extract(self, text: str, current_result: OCRResult) -> None:
        # 1. Composite Extraction (Code + Name)
        if not current_result.bankCode:
            m_code = re.search(r"(\d{4})\s*[-–]\s*(?:BANCO\s+)?([A-ZÁÉÍÓÚÑ\s]+)", text, re.IGNORECASE)
            if m_code:
                current_result.bankCode = m_code.group(1)
                # Also try to improve bankName if possible
                name = (m_code.group(2) or current_result.bankName or "").strip()
                if name:
                    name = name.splitlines()[0].strip()
                    name_upper = name.upper()
                    current_result.bankName = f"BANCO {name_upper}" if not name_upper.startswith("BANCO") else name_upper

        # 2. Standalone Code Fallback
        if not current_result.bankCode:
             # Ensure we don't match across lines
            m_near = re.search(r"(\d{4})[^\w\n]{0,6}BANCO", text, re.IGNORECASE)
            if m_near:
                current_result.bankCode = m_near.group(1)
            else:
                m_banklabel = re.search(r"Banco" + r"[\s:,\-]*" + r"(\d{4})", text, re.IGNORECASE)
                if m_banklabel:
                    current_result.bankCode = m_banklabel.group(1)
                else:
                    # Look for code on the same line as Banco
                    m_inline = re.search(r"Banco[^\n]*?(\d{4})", text, re.IGNORECASE)
                    if m_inline:
                        current_result.bankCode = m_inline.group(1)

class AmountFallback(FallbackExtractor):
    def extract(self, text: str, current_result: OCRResult) -> None:
        amount_text = current_result.amount
        
        if not amount_text:
            # Strategy 1: Look for "Monto" label
            m_lbl = re.search(r"(?:Monto|Total|Importe)\s*[:\.]?\s*([\d\.,\s]+(?:Bs|VES|VEF|USD|EUR)?)", text, re.IGNORECASE)
            if m_lbl:
                 amount_text = m_lbl.group(1).strip()
            else:
                 # Strategy 2: Look for currency symbol/code with number
                 m_cur = re.search(r"((?:Bs|VES|VEF|USD|EUR)\.?\s*[\d\.,]+|[\d\.,]+\s*(?:Bs|VES|VEF|USD|EUR))", text, re.IGNORECASE)
                 if m_cur:
                     amount_text = m_cur.group(1).strip()
                 else:
                     # Strategy 3: Fallback to loose number search
                     m_amt = re.search(r"(?<![\d/-])(\d{1,3}(?:[\.\s]\d{3})*(?:,\d{1,2})?)(?![\d/-])", text)
                     if m_amt:
                         amount_text = m_amt.group(1).strip()
        
        if amount_text:
             current_result.amount = amount_text

        # Process values
        if current_result.amount:
            val, typ = parse_amount(current_result.amount)
            current_result.amount_value = val
            if typ:
                current_result.amount_type = typ
        
        # If currency not captured, try to find in full text
        if not current_result.amount_type:
            m_cur_all = re.search(r"\b(Bs|VES|VEF|USD|EUR)\b", text, re.IGNORECASE)
            if m_cur_all:
                current_result.amount_type = m_cur_all.group(1).upper()

        current_result.amount_value = normalize_amount_to_numeric(current_result.amount_value)

class DateFallback(FallbackExtractor):
    def extract(self, text: str, current_result: OCRResult) -> None:
        if not current_result.date:
            d = parse_date_from_text(text)
            if d:
                current_result.date = d
        else:
            # Normalize existing date
            d = parse_date_from_text(current_result.date)
            if d:
                current_result.date = d

class IdentificationFallback(FallbackExtractor):
    def extract(self, text: str, current_result: OCRResult) -> None:
        if not current_result.identification:
            lines = [line.strip() for line in re.split(r"[\r\n]+", text) if line.strip()]
            found = False
            for line in lines:
                if re.search(r"identificaci[oó]n|identificacion|cedula|ci", line, re.IGNORECASE):
                    m_id = re.search(r"([VEJPG]-?\d+|\d{7,10})", line, re.IGNORECASE)
                    if m_id:
                        current_result.identification = m_id.group(1)
                        found = True
                        break
            if not found:
                m_id = re.search(r"\b(?:[VEJPG]-?\d+|\d{7,9})\b", text, re.IGNORECASE)
                if m_id:
                    current_result.identification = m_id.group(0)

class OriginDestinationFallback(FallbackExtractor):
    def extract(self, text: str, current_result: OCRResult) -> None:
        if not current_result.origin:
            m_org = re.search(r"\b(\d{4}\D{1,6}\d{4})\b", text)
            if m_org:
                current_result.origin = m_org.group(1)

        if not current_result.destination:
            m_dest = re.search(r"\b04\d{8,11}\b", text)
            if m_dest:
                current_result.destination = m_dest.group(0)

class ConceptFallback(FallbackExtractor):
    def extract(self, text: str, current_result: OCRResult) -> None:
        if not current_result.concept:
            m_con = re.search(r"(?:concepto|concept|concepto\s*:|descripcion|detalle)\s*[:\-]?\s*(.+)", text, re.IGNORECASE)
            if m_con:
                cand = m_con.group(1).strip()
                cand = cand.splitlines()[0].strip()
                if cand:
                    current_result.concept = cand[:30]
        
        if not current_result.concept:
            lines = [line.strip() for line in re.split(r"[\r\n]+", text) if line.strip()]
            blacklist = [r"^\d+$", r"^\d{1,3}(?:[\.\s]\d{3})*(?:,\d{1,2})?$", r"fecha", r"operaci", r"identifi", r"origen", r"destino", r"banco", r"cuenta", r"monto", r"saldo"]
            cand = None
            for line in reversed(lines):
                s = line.strip()
                if len(s) == 0 or len(s) > 100:
                    continue
                low = s.lower()
                skip = False
                for pat in blacklist:
                    if re.search(pat, low, re.IGNORECASE):
                        skip = True
                        break
                if skip:
                    continue
                if re.search(r"\d{4}\W*(?:BANCO|BANK)", s, re.IGNORECASE):
                    continue
                if re.fullmatch(r"[\d\-\s]{5,}", s):
                    continue
                if re.search(r"[A-Za-zÁÉÍÓÚÑáéíóúñ]", s):
                    cand = s
                    break
            if cand:
                current_result.concept = cand[:30]

        # Normalize
        if current_result.concept:
            current_result.concept = clean_concept(current_result.concept, current_result.bankName)
