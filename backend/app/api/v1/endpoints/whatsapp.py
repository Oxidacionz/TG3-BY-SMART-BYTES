from fastapi import APIRouter, Request, HTTPException, Response
import requests
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

# --- WAHA Management Endpoints ---

WAHA_URL = "http://localhost:3000"
WAHA_API_KEY = "123"

def get_waha_headers():
    return {
        "X-Api-Key": WAHA_API_KEY,
        "Content-Type": "application/json"
    }

@router.get("/status", summary="Check WAHA Session Status")
def get_session_status():
    """Proxy to get 'default' session status from WAHA"""
    try:
        url = f"{WAHA_URL}/api/sessions/default"
        resp = requests.get(url, headers=get_waha_headers(), timeout=5)
        
        if resp.status_code == 404:
             return {"status": "STOPPED", "detail": "Session does not exist"}
        
        return resp.json()
    except Exception as e:
        logger.error(f"WAHA Connection Error: {e}")
        return {"status": "ERROR", "detail": str(e)}

@router.post("/connect", summary="Start WAHA Session")
def start_session():
    """Ensure session exists and start it to generate QR"""
    try:
        # 1. Try to create session (idempotent-ish)
        create_url = f"{WAHA_URL}/api/sessions"
        payload = {"name": "default", "config": {"proxy": None}}
        requests.post(create_url, json=payload, headers=get_waha_headers(), timeout=5)
        
        # 2. Start session
        start_url = f"{WAHA_URL}/api/sessions/default/start"
        resp = requests.post(start_url, headers=get_waha_headers(), timeout=5)
        
        return resp.json()
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Failed to start session: {e}")

@router.get("/qr", summary="Get QR Code Image")
def get_qr_code():
    """Proxy getting the QR code image"""
    try:
        url = f"{WAHA_URL}/api/default/auth/qr?format=image"
        resp = requests.get(url, headers=get_waha_headers(), timeout=10)
        
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail="QR not ready or session active")
            
        return Response(content=resp.content, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching QR: {e}")

@router.get("/groups", summary="List WhatsApp Groups")
def list_groups():
    """Fetch groups from the connected account"""
    try:
        url = f"{WAHA_URL}/api/sessions/default/groups"
        resp = requests.get(url, headers=get_waha_headers(), timeout=10)
        return resp.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching groups: {e}")
