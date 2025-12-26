from pydantic import BaseModel
from typing import Optional, List

class ChatRequest(BaseModel):
    message: str
    context_data: Optional[dict] = None # Optional extra context from frontend

class ChatResponse(BaseModel):
    response: str
    related_actions: List[str] = [] # e.g. ["Ver Transacciones", "Ver Balance"]

class AudioResponse(BaseModel):
    transcript: str
    response: str
