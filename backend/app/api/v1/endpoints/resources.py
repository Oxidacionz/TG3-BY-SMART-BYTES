from fastapi import APIRouter
from src.transactions.infrastructure.repository import transaction_repo
from typing import List, Dict, Any

router = APIRouter()

@router.get("/clients", response_model=List[Dict[str, Any]])
async def get_clients():
    return await transaction_repo.get_clients()

@router.get("/operators", response_model=List[Dict[str, Any]])
async def get_operators():
    return await transaction_repo.get_operators()
