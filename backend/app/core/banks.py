from typing import Optional
import re

# Mapping: Bank Code -> Bank Name
# Source: SUDEBAN / User provided
from app.core.bank_catalog import BANK_CODES, BANK_KEYWORDS



def get_bank_name(code: str) -> Optional[str]:
    """Returns the official bank name for a given code."""
    return BANK_CODES.get(code)

def get_bank_code(name: str) -> Optional[str]:
    """
    Infers the bank code from a bank name string using keyword matching.
    Case-insensitive.
    """
    if not name:
        return None
    
    name_upper = name.upper()
    
    # Direct lookup first (if exact match)
    for keyword, code in BANK_KEYWORDS.items():
        if keyword in name_upper:
            return code
            
    return None
