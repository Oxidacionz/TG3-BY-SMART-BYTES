from fastapi import APIRouter
from app.api.v1.endpoints import ocr, scanner, whatsapp, transactions, stats, resources

api_router = APIRouter()
api_router.include_router(ocr.router, prefix="/ocr", tags=["OCR (Legacy)"])
api_router.include_router(scanner.router, prefix="/scanner", tags=["Smart Scanner"])
api_router.include_router(whatsapp.router, prefix="/webhook/whatsapp", tags=["WhatsApp"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
api_router.include_router(stats.router, prefix="/stats", tags=["Dashboard Stats"])
api_router.include_router(resources.router, prefix="/resources", tags=["Resources"])
