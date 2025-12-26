from fastapi import APIRouter
from src.dashboard.application.service import DashboardService
from src.dashboard.domain.schemas import DashboardStats

router = APIRouter()
service = DashboardService()

@router.get("/", response_model=DashboardStats)
def get_dashboard_stats():
    return service.get_stats()
