from fastapi import APIRouter, UploadFile, File, HTTPException
from src.scanner.application.scanner_service import scanner_service
from src.transactions.domain.transaction import Transaction

router = APIRouter()

@router.post("/", response_model=Transaction)
async def scan_receipt(file: UploadFile = File(...)):
    """
    Scans a receipt image using Gemini AI and returns a structured Transaction.
    """
    try:
        content = await file.read()
        transaction = await scanner_service.scan_receipt(
            file_content=content, 
            filename=file.filename or "unknown",
            content_type=file.content_type or "application/octet-stream"
        )
        return transaction
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Log error detallado
        print(f"Server Error in Scanner: {e}") 
        raise HTTPException(status_code=500, detail=f"Scanner Error: {str(e)}")
