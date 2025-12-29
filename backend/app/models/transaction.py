"""
SQLAlchemy models for transaction data.
Defines the database schema for storing scanned receipts.
"""
from sqlalchemy import Column, String, Numeric, DateTime, Text, Integer
from datetime import datetime
import uuid
from app.core.database_sb import Base


class Transaction(Base):
    """
    Transaction model for storing receipt data.
    Compatible with both SQLite and PostgreSQL/Supabase.
    """
    __tablename__ = "transactions"
    
    # Primary key
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # User association (optional, for multi-tenant systems)
    user_id = Column(String(36), nullable=True, index=True)
    
    # Transaction details
    platform = Column(String(50), nullable=False, index=True)
    amount = Column(Numeric(precision=18, scale=2), nullable=False)
    currency = Column(String(10), nullable=False)
    
    # Account Book Logic
    category = Column(String(50), nullable=True, index=True) # e.g., 'Venta', 'Gasto Operativo', 'Compra Divisa'
    transaction_type = Column(String(20), nullable=False, default="ENTRADA") # ENTRADA, SALIDA
    status = Column(String(20), default="PENDING") # PENDING, COMPLETED, FAILED, REJECTED
    
    # Currency Conversion
    exchange_rate = Column(Numeric(precision=18, scale=6), default=1.0)
    market_rate = Column(Numeric(precision=18, scale=6), default=0.0) # New: Tasa de Mercado
    profit = Column(Numeric(precision=18, scale=2), default=0.00) # New: Ganancia Estimada
    
    amount_usd = Column(Numeric(precision=18, scale=2), default=0.00) # Calculated equivalent
    manual_exit_amount = Column(Numeric(precision=18, scale=2), default=0.00) # New: Override exit amount
    exit_currency = Column(String(10), nullable=True) # New: Currency of exit
    
    # Fees & Taxes
    tax_amount = Column(Numeric(precision=18, scale=2), default=0.00)
    commission_amount = Column(Numeric(precision=18, scale=2), default=0.00)
    net_amount = Column(Numeric(precision=18, scale=2), default=0.00) # amount - fees
    
    # Relations
    account_id = Column(String(36), nullable=True, index=True) # Linked Account
    session_id = Column(String(36), nullable=True, index=True) # Cash Session
    branch_id = Column(String(36), nullable=True, index=True) # Branch
    
    related_transaction_id = Column(String(36), nullable=True, index=True) # For Exchanges/Transfers
    client_id = Column(String(36), nullable=True, index=True) # Linked Client/Provider
    
    # Optional fields
    reference_id = Column(String(100), nullable=True, index=True)
    transaction_date = Column(DateTime, nullable=True, index=True)
    sender_name = Column(String(200), nullable=True)
    receiver_name = Column(String(200), nullable=True)
    raw_text_snippet = Column(Text, nullable=True)
    
    # Evidence
    evidence_url = Column(String(500), nullable=True)
    evidence_ocr_json = Column(Text, nullable=True) # JSON string
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return (
            f"<Transaction(id={self.id}, "
            f"type={self.transaction_type}, "
            f"amount={self.amount} {self.currency}, "
            f"status={self.status})>"
        )
    
    def to_dict(self):
        """Convert model to dictionary."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "platform": self.platform,
            "amount": float(self.amount),
            "currency": self.currency,
            "category": self.category,
            "transaction_type": self.transaction_type,
            "status": self.status,
            "exchange_rate": float(self.exchange_rate) if self.exchange_rate else 1.0,
            "amount_usd": float(self.amount_usd) if self.amount_usd else 0.0,
            "net_amount": float(self.net_amount) if self.net_amount else 0.0,
            "account_id": self.account_id,
            "session_id": self.session_id,
            "related_transaction_id": self.related_transaction_id,
            "client_id": self.client_id,
            "reference_id": self.reference_id,
            "transaction_date": self.transaction_date.isoformat() if self.transaction_date else None,
            "sender_name": self.sender_name,
            "receiver_name": self.receiver_name,
            "evidence_url": self.evidence_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
