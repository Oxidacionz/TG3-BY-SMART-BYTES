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

# 2. El Modelo de Salida (Lo que la IA debe rellenar)
class TransactionReceipt(BaseModel):
    platform: FinancialPlatform = Field(
        ..., 
        description="Banco o plataforma detectada en el comprobante."
    )
    
    amount: float = Field(
        ..., 
        description="Monto exacto de la transacción. Usar punto para decimales."
    )
    
    currency: Currency = Field(
        ..., 
        description="Moneda detectada (ISO 4217 o Crypto)."
    )
    
    reference_id: Optional[str] = Field(
        None, 
        description="Número de referencia, confirmación o ID de transacción."
    )
    
    transaction_date: Optional[datetime] = Field(
        None, 
        description="Fecha y hora de la transacción."
    )
    
    sender_name: Optional[str] = Field(
        None, 
        description="Nombre de quien envía el dinero (si aparece)."
    )
    
    receiver_name: Optional[str] = Field(
        None, 
        description="Nombre del beneficiario (si aparece)."
    )

    receiver_doc_id: Optional[str] = Field(
        None,
        description="Cédula, RIF o ID del beneficiario/receptor. Formatos comunes: J-12345678-9, V-12345678."
    )
    
    sender_doc_id: Optional[str] = Field(
        None,
        description="Cédula, RIF o ID del ordenante (si aparece)."
    )

    sender_bank: Optional[str] = Field(
        None,
        description="Banco de origen (desde donde se envía)."
    )

    receiver_bank: Optional[str] = Field(
        None,
        description="Banco de destino (hacia donde llega)."
    )

    transaction_fee: Optional[float] = Field(
        None,
        description="Comisión bancaria o de red detectada (si aparece)."
    )
    
    raw_text_snippet: Optional[str] = Field(
        None, 
        description="Pequeño fragmento de texto clave donde se encontró el monto para auditoría."
    )

    requires_manual_review: bool = Field(
        False,
        description="True si la IA tiene dudas significativas o el comprobante es ilegible."
    )
    
    manual_review_reason: Optional[str] = Field(
        None,
        description="Razón por la cual se solicita revisión manual (ej. 'Referencia ilegible', 'Monto ambiguo')."
    )

    # Validación personalizada para limpiar referencias sucias
    @field_validator('reference_id')
    @classmethod
    def clean_reference(cls, v):
        if v:
            # Eliminar espacios y caracteres no alfanuméricos comunes en errores de OCR
            return v.replace(" ", "").replace("-", "").upper()
        return v
