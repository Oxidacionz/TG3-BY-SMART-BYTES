from fastapi import APIRouter, Request, HTTPException
from app.core.repository import repo
from app.core.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()

@router.post("/", summary="WhatsApp Webhook")
async def whatsapp_webhook(request: Request):
    """
    Webhook para integración con WhatsApp (n8n).
    Recibe un JSON con datos de transacciones.
    """
    try:
        data = await request.json()
        logger.info(f"WhatsApp webhook received: {data}")
        
        if not data:
             raise HTTPException(status_code=400, detail="Empty payload")

        # Save to Repository
        saved_tx = await repo.save_transaction(data)
        
        return {"status": "success", "transaction_id": saved_tx.get('id')}
        
    except Exception as e:
        logger.error(f"Error in WhatsApp webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))
