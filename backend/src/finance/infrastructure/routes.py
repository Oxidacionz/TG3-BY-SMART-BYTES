from fastapi import APIRouter
from typing import List
from src.finance.infrastructure.repository import finance_repo
from src.finance.domain.schemas import AccountDTO, SessionDTO

router = APIRouter()

@router.get("/accounts", response_model=List[AccountDTO])
async def get_accounts():
    return finance_repo.get_accounts()

@router.get("/sessions", response_model=List[SessionDTO])
async def get_sessions():
    return finance_repo.get_sessions()
