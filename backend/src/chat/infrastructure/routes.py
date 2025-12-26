from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from src.chat.infrastructure.database import get_chat_db, init_chat_db
from src.chat.application.service import ChatService
from src.chat.domain.models import MessageResponse, InboxItem, MessageCreate

# Initialize DB tables
init_chat_db()

router = APIRouter()

def get_service(db: Session = Depends(get_chat_db)):
    service = ChatService(db)
    # Ensure raw data exists (Mock mode style)
    service.seed_demo_data_if_empty() 
    return service

@router.get("/inbox", response_model=list[InboxItem])
async def get_inbox(service: ChatService = Depends(get_service)):
    return await service.get_inbox()

@router.get("/conversation/{contact_id}", response_model=list[MessageResponse])
def get_conversation(contact_id: str, service: ChatService = Depends(get_service)):
    return service.get_conversation(contact_id)

@router.post("/send", response_model=MessageResponse)
def send_message(
    receiver_id: str = Body(...),
    content: str = Body(...),
    service: ChatService = Depends(get_service)
):
    return service.send_message(receiver_id, content)
