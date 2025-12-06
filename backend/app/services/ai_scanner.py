import base64
import os
from decimal import Decimal
from datetime import datetime
from fastapi import UploadFile, HTTPException
from app.schemas.receipt import TransactionReceipt
from app.core.prompts import SYSTEM_PROMPT
from app.core.config import settings
from openai import AsyncOpenAI

class SmartScannerService:
    def __init__(self):
        # Initialize OpenAI Client
        # Pydantic Settings should handle API_KEY presence or standard os.getenv
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            # We allow init without key, but processing will fail. 
            # This is "Ready for Work" state: requires configuration.
            self.client = None
        else:
            self.client = AsyncOpenAI(api_key=api_key)

    async def process_receipt_image(self, file: UploadFile) -> TransactionReceipt:
        """
        Processes an image file using OpenAI GPT-4o to extract financial data.
        """
        if not self.client:
             raise HTTPException(
                 status_code=500, 
                 detail="OpenAI API Key not configured. Please set OPENAI_API_KEY in environment variables."
             )

        # 1. Leer imagen y convertir a Base64
        image_content = await file.read()
        base64_image = base64.b64encode(image_content).decode('utf-8')

        try:
            # 2. Llamada al Modelo Multimodal
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": SYSTEM_PROMPT
                    },
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Analiza este comprobante bancario y extrae los datos."},
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                            }
                        ]
                    }
                ],
                response_format={"type": "json_object"}
            )
            
            # 3. Parsear y Validar con Pydantic
            raw_json = response.choices[0].message.content
            return TransactionReceipt.model_validate_json(raw_json)

        except Exception as e:
            # Log error properly in production
            print(f"SmartScanner Error: {str(e)}")
            raise HTTPException(status_code=422, detail=f"Error processing document: {str(e)}")
