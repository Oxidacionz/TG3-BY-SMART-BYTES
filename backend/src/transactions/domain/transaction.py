from enum import Enum
from decimal import Decimal
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator

# 1. Estandarización de Plataformas y Tipos
class FinancialPlatform(str, Enum):
    # Banca Venezuela
    BANESCO_VE = "BANESCO_VE"
    MERCANTIL_VE = "MERCANTIL_VE"
    PROVINCIAL = "PROVINCIAL"
    BDV = "BANCO_DE_VENEZUELA"
    PAGO_MOVIL = "PAGO_MOVIL_GENERICO"
    
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

class TransactionType(str, Enum):
    ENTRADA = "ENTRADA"  # Money IN
    SALIDA = "SALIDA"    # Money OUT
    NEUTRO = "NEUTRO"    # Internal Transfer / Exchange Pivot

class TransactionCategory(str, Enum):
    # Entradas
    VENTA = "VENTA"
    COBRO_DEUDA = "COBRO_DEUDA"
    INYECCION_CAPITAL = "INYECCION_CAPITAL"
    
    # Salidas
    GASTO_OPERATIVO = "GASTO_OPERATIVO"
    PAGO_PROVEEDOR = "PAGO_PROVEEDOR"
    NOMINA = "NOMINA"
    RETIRO_CAPITAL = "RETIRO_CAPITAL"
    
    # Especiales
    CAMBIO_DIVISA = "CAMBIO_DIVISA"
    TRANSFERENCIA_INTERNA = "TRANSFERENCIA_INTERNA"
    AJUSTE_INVENTARIO = "AJUSTE_INVENTARIO"
    OTROS = "OTROS"

class TransactionStatus(str, Enum):
    PENDING = "PENDING"       # Created but not confirmed (e.g. Zelle pending)
    COMPLETED = "COMPLETED"   # Verified money in bank
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    PENDING_DELIVERY = "PENDING_DELIVERY" # Money received, but counterpart not sent
    ACCOUNTS_PAYABLE = "ACCOUNTS_PAYABLE" # Expense recorded, payment pending

# 2. Entidad de Dominio
class Transaction(BaseModel):
    id: Optional[str] = Field(None, description="ID único de base de datos (UUID)")
    
    platform: FinancialPlatform = Field(..., description="Banco o plataforma.")
    amount: Decimal = Field(..., description="Monto exacto.")
    currency: Currency = Field(..., description="Moneda detectada.")
    
    transaction_type: TransactionType = Field(..., description="ENTRADA / SALIDA / NEUTRO")
    category: TransactionCategory = Field(TransactionCategory.OTROS, description="Categoría financiera")
    status: TransactionStatus = Field(TransactionStatus.PENDING, description="Estado de la transacción")
    
    reference_id: Optional[str] = Field(None, description="Número de referencia.")
    transaction_date: Optional[datetime] = Field(None, description="Fecha y hora.")
    
    exchange_rate: Decimal = Field(1.0, description="Tasa de cambio aplicada")
    market_rate: Optional[Decimal] = Field(0.0, description="Tasa de mercado (para cálculo de spread)")
    profit: Optional[Decimal] = Field(0.0, description="Ganancia estimada")
    
    amount_usd: Decimal = Field(0.0, description="Monto equivalente en USD")
    net_amount: Decimal = Field(0.0, description="Monto neto después de comisiones")
    
    manual_exit_amount: Optional[Decimal] = Field(0.0, description="Monto de salida manual (override)")
    exit_currency: Optional[str] = Field(None, description="Moneda de salida")
    
    # Linked Transactions (for Exchanges & Transfers)
    related_transaction_id: Optional[str] = Field(None, description="ID de la transacción vinculada (ej. par de un cambio)")
    
    account_id: Optional[str] = None
    session_id: Optional[str] = None
    # Data del Tercero (Para Cobrar/Pagar)
    client_id: Optional[str] = None
    client_name: Optional[str] = None
    
    description: Optional[str] = None
    evidence_url: Optional[str] = None
    created_at: Optional[datetime] = None

    @field_validator('reference_id')
    @classmethod
    def clean_reference(cls, v):
        if v:
            return v.replace(" ", "").replace("-", "").upper()
        return v
