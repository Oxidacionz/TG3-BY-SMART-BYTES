from pydantic import BaseModel


class OCRResult(BaseModel):
    # original amount text as captured (e.g. "60,00 Bs")
    amount: str | None
    # normalized numeric value: int for whole values, float for fractional values
    amount_value: float | int | None = None
    # amount type / currency code or label (e.g. "Bs", "USD")
    amount_type: str | None = None

    date: str | None
    operation: str | None
    identification: str | None
    origin: str | None
    destination: str | None
    bankCode: str | None
    bankName: str | None
    concept: str | None
    
    # Audit
    raw_text: str | None = None
    confidence: float | int | None = None
