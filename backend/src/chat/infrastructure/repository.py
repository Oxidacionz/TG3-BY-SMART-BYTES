from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from src.chat.domain.models import ChatMessageModel, MessageCreate
from datetime import datetime
from typing import List, Dict, Any

class ChatRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_message(self, msg: MessageCreate) -> ChatMessageModel:
        db_msg = ChatMessageModel(
            sender_id=msg.sender_id,
            sender_name=msg.sender_name,
            sender_avatar=msg.sender_avatar,
            receiver_id=msg.receiver_id,
            content=msg.content,
            created_at=datetime.utcnow(),
            is_read=False
        )
        self.db.add(db_msg)
        self.db.commit()
        self.db.refresh(db_msg)
        return db_msg

    def get_conversation(self, contact_id: str, my_id: str = "ADMIN") -> List[ChatMessageModel]:
        # Fetch messages where (sender=me AND receiver=them) OR (sender=them AND receiver=me)
        return self.db.query(ChatMessageModel).filter(
            or_(
                and_(ChatMessageModel.sender_id == my_id, ChatMessageModel.receiver_id == contact_id),
                and_(ChatMessageModel.sender_id == contact_id, ChatMessageModel.receiver_id == my_id)
            )
        ).order_by(ChatMessageModel.created_at.asc()).all()

    def mark_as_read(self, contact_id: str, my_id: str = "ADMIN"):
        # Mark messages FROM contact_id TO me as read
        self.db.query(ChatMessageModel).filter(
            ChatMessageModel.sender_id == contact_id,
            ChatMessageModel.receiver_id == my_id,
            ChatMessageModel.is_read == False
        ).update({"is_read": True})
        self.db.commit()

    def get_last_messages(self, my_id: str = "ADMIN"):
        # This is complex in pure ORM, might need raw SQL or python processing for simple SQLite
        # We want the latest message for every conversation involving my_id
        # For simplicity in this demo: fetch all messages involving me, and group in Python
        # (Not efficient for millions of rows, but fine for local tool)
        
        all_msgs = self.db.query(ChatMessageModel).filter(
            or_(ChatMessageModel.sender_id == my_id, ChatMessageModel.receiver_id == my_id)
        ).order_by(ChatMessageModel.created_at.asc()).all()
        
        conversations = {}
        unread_counts = {}

        for m in all_msgs:
            other_id = m.receiver_id if m.sender_id == my_id else m.sender_id
            conversations[other_id] = m # Since ordered by asc, the last one will overwrite, leaving the latest
            
            if m.receiver_id == my_id and not m.is_read:
                unread_counts[other_id] = unread_counts.get(other_id, 0) + 1

        return conversations, unread_counts
