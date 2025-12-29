from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.shared.config.settings import settings
from src.transactions.infrastructure.routes import router as transactions_router
from src.dashboard.infrastructure.routes import router as dashboard_router

app = FastAPI(
    title="TG3 Smart Bytes API (Screaming Architecture)",
    version="2.0.0",
    description="API Modularizada por Dominios (Transactions, Dashboard, Finance)"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from src.scanner.infrastructure.routes import router as scanner_router
from src.shared.infrastructure.resources_routes import router as resources_router

# Register Feature Routers
app.include_router(transactions_router, prefix="/api/v1/transactions", tags=["Transactions"])
app.include_router(dashboard_router, prefix="/api/v1/stats", tags=["Dashboard"])
app.include_router(scanner_router, prefix="/api/v1/scanner", tags=["Scanner"])
app.include_router(resources_router, prefix="/api/v1/resources", tags=["Resources"])

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "architecture": "modular"}

# Legacy Compatibility (Optional, if needed for testing)
# user-agent check logic or redirect logic could go here
