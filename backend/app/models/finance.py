from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.core.database_sb import Base

class AccountType(str, enum.Enum):
    CASH = "CASH"
    BANK = "BANK"
    EWALLET = "EWALLET"
    CRYPTO = "CRYPTO"

class SessionStatus(str, enum.Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"

class Account(Base):
    __tablename__ = "accounts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False) # Store enum as string for SQLite compatibility
    currency = Column(String(10), nullable=False, default="USD")
    current_balance = Column(Numeric(precision=18, scale=2), default=0.00)
    branch_id = Column(String(36), nullable=True, index=True) # Sucursal
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CashSession(Base):
    __tablename__ = "cash_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=False, index=True)
    branch_id = Column(String(36), nullable=False, index=True)
    status = Column(String(20), default="OPEN") # OPEN, CLOSED
    
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    
    initial_balance = Column(Numeric(precision=18, scale=2), default=0.00)
    current_balance = Column(Numeric(precision=18, scale=2), default=0.00) # Computed
    final_balance = Column(Numeric(precision=18, scale=2), nullable=True)
    
    notes = Column(String(500), nullable=True)
