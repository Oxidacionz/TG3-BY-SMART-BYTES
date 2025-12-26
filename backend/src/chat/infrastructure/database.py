from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Separate SQLite database for Chat
SQLALCHEMY_DATABASE_URL = "sqlite:///./chat.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocalChat = sessionmaker(autocommit=False, autoflush=False, bind=engine)

BaseChat = declarative_base()

def get_chat_db():
    db = SessionLocalChat()
    try:
        yield db
    finally:
        db.close()

def init_chat_db():
    BaseChat.metadata.create_all(bind=engine)
