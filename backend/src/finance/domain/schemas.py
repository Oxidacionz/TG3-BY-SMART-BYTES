from pydantic import BaseModel
from typing import Optional

class AccountDTO(BaseModel):
    id: str
    name: str
    type: str # CASH, BANK, EWALLET, CRYPTO
    currency: str
    current_balance: float
    branch_id: str

class SessionDTO(BaseModel):
    id: str
    user_id: str
    status: str
    initial_balance: float
    current_balance: float
