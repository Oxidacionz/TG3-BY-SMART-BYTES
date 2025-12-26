import re
from decimal import Decimal
from typing import Optional, Tuple

def parse_amount(text: str) -> Tuple[Optional[Decimal], Optional[str]]:
    """
    Parses an amount string to a Decimal and extracts currency type.
    Returns (amount_value, amount_type).
    """
    if not text:
        return None, None

    # Regex to find number and optional currency
    # Supports: 1.234,56 | 1,234.56 | 1234.56 | 1234,56
    m_val = re.search(r"([\d\.,\s]+?)\s*(Bs|VES|VEF|USD|EUR)?$", text, re.IGNORECASE)
    if not m_val:
        return None, None

    num_str = m_val.group(1).strip()
    cur = m_val.group(2)
    
    # Heuristic to determine decimal separator
    # 1. If both . and , present:
    #    - If last is ,, then , is decimal (1.234,56)
    #    - If last is ., then . is decimal (1,234.56)
    # 2. If only one present:
    #    - If , and len(suffix) == 2, assume decimal (common in VE)
    #    - If . and len(suffix) == 2, assume decimal
    #    - Ambiguous cases: assume comma is decimal for VE context unless it looks like 1.000
    
    amount_value = None
    try:
        if ',' in num_str and '.' in num_str:
            last_comma = num_str.rfind(',')
            last_dot = num_str.rfind('.')
            if last_comma > last_dot:
                # 1.234,56 -> 1234.56
                norm = num_str.replace('.', '').replace(',', '.')
            else:
                # 1,234.56 -> 1234.56
                norm = num_str.replace(',', '')
        elif ',' in num_str:
            # 1234,56 or 1,000
            # If comma is at end - 3 (1,000), it's likely thousand sep?
            # But in VE 1.000 is thousand. 1,000 is strange. 
            # Let's assume comma is decimal if it's not clearly a thousand sep (3 digits after)
            # Actually, standard VE is 1.234,56. So comma is decimal.
            norm = num_str.replace('.', '').replace(',', '.')
        else:
            # 1234.56 or 1000
            norm = num_str
            
        amount_value = Decimal(norm)
    except Exception:
        pass

    amount_type = cur.upper() if cur else None
    return amount_value, amount_type

def normalize_amount_to_numeric(amount_value: Optional[Decimal]) -> Optional[float]:
    """
    Converts Decimal to float or int (as float) for JSON serialization/storage.
    """
    if amount_value is None:
        return None
    try:
        # if value has no fractional part -> int-like float
        # But return type is float to be consistent, or int? 
        # Original code returned int if whole, else float.
        if amount_value == amount_value.to_integral():
            return int(amount_value)
        else:
            return float(amount_value)
    except Exception:
        try:
            return float(amount_value)
        except Exception:
            return None

def clean_bank_name(name: str) -> str:
    """
    Normalizes bank name.
    """
    if not name:
        return name
        
    # Example: 'PROVINCIAL' -> 'BBVA PROVINCIAL'
    try:
        bank_up = name.upper()
        if 'PROVINCIAL' in bank_up and 'BBVA' not in bank_up:
            return 'BBVA PROVINCIAL'
    except Exception:
        pass
    return name

def clean_concept(concept: str, bank_name: Optional[str] = None) -> str:
    """
    Cleans and truncates concept string.
    """
    if not concept:
        return concept
        
    c = concept.strip()
    # For BBVA PROVINCIAL receipts, 'Pago' is often an 'Abono'
    try:
        if bank_name and 'PROVINCIAL' in bank_name.upper() and c.lower() == 'pago':
            c = 'Abono'
    except Exception:
        pass
        
    # Capitalize first letter and truncate to 30 chars
    c = c[:30]
    if c:
        c = c[0].upper() + c[1:]
    return c

def parse_date_from_text(text: str) -> Optional[str]:
    """
    Finds a date pattern in text.
    """
    m_date = re.search(r"\b(\d{2})\s*([\/-])\s*(\d{2})\s*([\/-])\s*(\d{4})\b", text)
    if m_date:
        # Normalize to DD/MM/YYYY
        return f"{m_date.group(1)}/{m_date.group(3)}/{m_date.group(5)}"
    return None
