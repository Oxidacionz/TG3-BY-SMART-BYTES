from fastapi import APIRouter
from app.api.v1.endpoints import ocr, scanner, whatsapp, resources, rates

api_router = APIRouter()
api_router.include_router(ocr.router, prefix="/ocr", tags=["OCR (Legacy)"])
# Re-enable scanner route
api_router.include_router(scanner.router, prefix="/scanner", tags=["Smart Scanner"])
api_router.include_router(whatsapp.router, prefix="/webhook/whatsapp", tags=["WhatsApp"])

from src.transactions.infrastructure import routes as transaction_routes
api_router.include_router(transaction_routes.router, prefix="/transactions", tags=["Transactions"])

# api_router.include_router(stats.router, prefix="/stats", tags=["Dashboard Stats"]) # Legacy
from src.dashboard.infrastructure import routes as dashboard_routes
api_router.include_router(dashboard_routes.router, prefix="/stats", tags=["Dashboard Stats"])

api_router.include_router(resources.router, prefix="/resources", tags=["Resources"])
api_router.include_router(rates.router, prefix="/rates", tags=["Rates"])
api_router.include_router(rates.router, prefix="/rates", tags=["Rates"])

from src.finance.infrastructure import routes as finance_routes
api_router.include_router(finance_routes.router, prefix="/finance", tags=["Finance & Accounts"])

from src.chat.infrastructure import routes as chat_routes
api_router.include_router(chat_routes.router, prefix="/chat", tags=["Internal Chat"])

from src.advisor.infrastructure import routes as advisor_routes
api_router.include_router(advisor_routes.router, prefix="/advisor", tags=["AI Advisor"])

# Backwards-compatible alias: some clients/tests expect `/api/v1/process-ocr`
# Delegate to the existing ocr.process_ocr handler (keeps limiter and deps).
api_router.add_api_route("/process-ocr", ocr.process_ocr, methods=["POST"])
