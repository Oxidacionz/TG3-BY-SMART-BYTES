from sqlalchemy.orm import Session
from src.chat.infrastructure.repository import ChatRepository
from src.chat.domain.models import MessageCreate, InboxItem, ChatMessageModel
from src.transactions.infrastructure.repository import transaction_repo
from datetime import datetime, timedelta

class ChatService:
    def __init__(self, db: Session):
        self.repo = ChatRepository(db)
        self.my_id = "ADMIN" # Hardcoded for this single-user desktop app context

    async def get_inbox(self) -> list[InboxItem]:
        # 1. Get real history from Chat DB
        last_msgs, unread_counts = self.repo.get_last_messages(self.my_id)
        
        # 2. Get Potential Contacts from Main DB
        # Clients
        clients = await transaction_repo.get_clients() # Returns list of dicts
        # Operators
        operators = await transaction_repo.get_operators() # Returns list of dicts
        
        inbox_map = {}

        # Helper to add/update contact in map
        def update_map(contact_id, name, avatar, force_add=False):
            # If we have a message history, use it
            if contact_id in last_msgs:
                msg = last_msgs[contact_id]
                inbox_map[contact_id] = InboxItem(
                    contact_id=contact_id,
                    contact_name=name,
                    avatar=avatar,
                    last_message=msg.content,
                    last_message_time=msg.created_at,
                    unread_count=unread_counts.get(contact_id, 0),
                    status="online" # Mock status
                )
            elif force_add:
                # Add even if no messages
                inbox_map[contact_id] = InboxItem(
                    contact_id=contact_id,
                    contact_name=name,
                    avatar=avatar,
                    last_message="Iniciar conversación",
                    last_message_time=datetime.min, # Sort to bottom
                    unread_count=0,
                    status="offline"
                )

        # Add Support
        update_map("SUPPORT", "Soporte Técnico", "🛠️", force_add=True)
        
        # Add Operators (High priority)
        for op in operators:
            # Operator ID might be user_id from sessions, usually has 'admin' or something
            # If ID matches my_id, skip myself
            if op['id'] == self.my_id: continue
            update_map(op['id'], op['name'], op['avatar'], force_add=True)

        # Add Clients (Only if they have messages? Or maybe top 5 recent?)
        # For now, let's only add clients if they have history OR just merge from history
        for client in clients:
            update_map(client['id'], client['name'], "👤", force_add=False)

        # Also generic catch: if we have a message from someone NOT in the lists above
        for contact_id, msg in last_msgs.items():
            if contact_id not in inbox_map:
                # Unknown contact (maybe deleted)
                inbox_map[contact_id] = InboxItem(
                    contact_id=contact_id,
                    contact_name=msg.sender_name or f"User {contact_id}",
                    avatar=msg.sender_avatar or "❓",
                    last_message=msg.content,
                    last_message_time=msg.created_at,
                    unread_count=unread_counts.get(contact_id, 0),
                    status="offline"
                )

        # Convert to list and sort by time desc
        result = list(inbox_map.values())
        result.sort(key=lambda x: x.last_message_time, reverse=True)
        return result

    def send_message(self, receiver_id: str, content: str) -> ChatMessageModel:
        # Determine receiver name/avatar if possible? 
        # For sending, we just need the content and IDs. 
        # The frontend usually supplies the context.
        
        return self.repo.create_message(MessageCreate(
            sender_id=self.my_id,
            sender_name="Administrador",
            sender_avatar="👨‍💼",
            receiver_id=receiver_id,
            content=content
        ))

    def get_conversation(self, contact_id: str):
        self.repo.mark_as_read(contact_id, self.my_id)
        return self.repo.get_conversation(contact_id, self.my_id)

    def seed_demo_data_if_empty(self):
        # Check if empty
        if not self.repo.db.query(ChatMessageModel).first():
            from src.chat.domain.models import MessageCreate
            # Seed 1: Support saying Hello
            self.repo.create_message(MessageCreate(
                sender_id="SUPPORT", sender_name="Soporte Técnico", sender_avatar="🛠️",
                receiver_id=self.my_id, content="¡Hola! Bienvenido al sistema. ¿En qué podemos ayudarte?"
            ))
            
            # Seed 2: Operator Message
            self.repo.create_message(MessageCreate(
                sender_id="OP-001", sender_name="Operador Caja 1", sender_avatar="🐫",
                receiver_id=self.my_id, content="Jefe, ya cerré la caja del día."
            ))
            
            # Seed 3: Client Message (Simulated)
            self.repo.create_message(MessageCreate(
                sender_id="CLI-1", sender_name="Juan Perez", sender_avatar="👤",
                receiver_id=self.my_id, content="Confirmo la recepción de los $500. Gracias."
            ))
