from enum import Enum
from decimal import Decimal
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator

# 1. Estandarización de Plataformas
class FinancialPlatform(str, Enum):
    # Banca Venezuela
    BANESCO_VE = "BANESCO_VE"
    MERCANTIL_VE = "MERCANTIL_VE"
    PROVINCIAL = "PROVINCIAL"
    BDV = "BANCO_DE_VENEZUELA"
    PAGO_MOVIL = "PAGO_MOVIL_GENERICO" # Cuando no se distingue el banco
    
    # Banca Internacional / USA
    BOA = "BANK_OF_AMERICA"
    WELLS_FARGO = "WELLS_FARGO"
    CHASE = "CHASE"
    BANESCO_PA = "BANESCO_PANAMA"
    MERCANTIL_PA = "MERCANTIL_PANAMA"
    
    # Fintech & Crypto
    BINANCE = "BINANCE"
    ZELLE = "ZELLE"
    PAYPAL = "PAYPAL"
    WALLY = "WALLY"
    ZINLI = "ZINLI"
    UNKNOWN = "UNKNOWN"

class Currency(str, Enum):
    USD = "USD"
    VES = "VES"
    EUR = "EUR"
    USDT = "USDT"

# 2. Entidad de Dominio
class Transaction(BaseModel):
    id: Optional[str] = Field(None, description="ID único de base de datos (UUID)")
    
    platform: FinancialPlatform = Field(
        ..., 
        description="Banco o plataforma."
    )
    
    amount: Decimal = Field(
        ..., 
        description="Monto exacto."
    )
    
    currency: Currency = Field(
        ..., 
        description="Moneda detectada."
    )
    
    reference_id: Optional[str] = Field(
        None, 
        description="Número de referencia."
    )
    
    transaction_date: Optional[datetime] = Field(
        None, 
        description="Fecha y hora."
    )
    
    transaction_type: str = Field("ENTRADA", description="Tipo de movimiento: ENTRADA / SALIDA")
    category: Optional[str] = Field(None, description="Categoría del movimiento (Venta, Gasto, etc)")
    status: str = Field("PENDING", description="Estado de conciliación (PENDING, COMPLETED, FAILED, REJECTED)")
    
    exchange_rate: Decimal = Field(1.0, description="Tasa de cambio aplicada")
    amount_usd: Decimal = Field(0.0, description="Monto equivalente en USD")
    net_amount: Decimal = Field(0.0, description="Monto neto después de comisiones")
    
    account_id: Optional[str] = None
    session_id: Optional[str] = None
    branch_id: Optional[str] = None
    
    sender_name: Optional[str] = None
    receiver_name: Optional[str] = None
    raw_text: Optional[str] = None
    evidence_url: Optional[str] = None
    created_at: Optional[datetime] = None

    @field_validator('reference_id')
    @classmethod
    def clean_reference(cls, v):
        if v:
            return v.replace(" ", "").replace("-", "").upper()
        return v
