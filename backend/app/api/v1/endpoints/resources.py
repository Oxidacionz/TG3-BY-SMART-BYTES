from fastapi import APIRouter
from app.core.repository import repo
from typing import List, Dict, Any

router = APIRouter()

@router.get("/clients", response_model=List[Dict[str, Any]])
async def get_clients():
    return await repo.get_clients()

@router.get("/operators", response_model=List[Dict[str, Any]])
async def get_operators():
    return await repo.get_operators()
