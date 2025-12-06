from fastapi import APIRouter
from app.core.repository import repo
from typing import Dict, Any

router = APIRouter()

@router.get("/")
async def get_dashboard_stats():
    return await repo.get_stats()
