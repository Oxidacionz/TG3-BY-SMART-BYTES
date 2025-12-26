import google.generativeai as genai
from src.shared.config.settings import settings
import random

class GeminiAdvisorClient:
    def __init__(self):
        self.api_keys = settings.parsed_api_keys
        self.configure_api()

    def configure_api(self):
        if not self.api_keys:
            print("⚠️ No Gemini API Keys found!")
            return
        
        # Simple rotation or pick first
        key = random.choice(self.api_keys)
        genai.configure(api_key=key)

    def generate_response(self, system_prompt: str, user_message: str) -> str:
        try:
            model = genai.GenerativeModel('gemini-flash-latest')
            # model = genai.GenerativeModel('gemini-pro') # Fallback if flash not avail
            
            chat = model.start_chat(history=[
                {"role": "user", "parts": [system_prompt]},
                {"role": "model", "parts": ["Entendido. Soy el Profesor Toro, asesor financiero experto. Me limitaré estrictamente al contexto proporcionado."]}
            ])
            
            response = chat.send_message(user_message)
            return response.text
        except Exception as e:
            print(f"Error generating response: {e}")
            return "Lo siento, tuve un problema procesando tu consulta. Intenta de nuevo."

gemini_client = GeminiAdvisorClient()
