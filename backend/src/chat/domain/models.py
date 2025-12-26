from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from src.chat.infrastructure.database import BaseChat

# --- SQLAlchemy Models ---

class ChatMessageModel(BaseChat):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(String, index=True) # ID of the user/operator/client
    sender_name = Column(String)
    sender_avatar = Column(String, nullable=True) # Emoji or URL
    
    receiver_id = Column(String, index=True)
    content = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
    
    # Type: "text", "image", "system"
    msg_type = Column(String, default="text") 


# --- Pydantic Schemas ---

class MessageCreate(BaseModel):
    receiver_id: str
    content: str
    sender_id: str # In a real app, this comes from auth token, but for now we might pass it or default it
    sender_name: str
    sender_avatar: Optional[str] = "👤"

class MessageResponse(BaseModel):
    id: int
    sender_id: str
    sender_name: str
    sender_avatar: Optional[str]
    content: str
    created_at: datetime
    is_read: bool

    class Config:
        from_attributes = True

class InboxItem(BaseModel):
    contact_id: str
    contact_name: str
    avatar: str
    last_message: str
    last_message_time: datetime
    unread_count: int
    status: str = "offline" # offline, online
