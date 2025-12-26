import json
from src.advisor.infrastructure.gemini_client import gemini_client
from src.finance.infrastructure.repository import finance_repo
from src.transactions.infrastructure.repository import transaction_repo

class AdvisorService:
    def __init__(self):
        self.client = gemini_client

    async def get_financial_context(self) -> str:
        # 1. Get Accounts
        accounts = finance_repo.get_accounts()
        # 2. Get Recent Transactions (limit 10)
        # Assuming transaction_repo.get_all returns all, we might want to slice or add a limit param later
        # For now, just getting all and slicing here is fine for MVP size
        all_txs = await transaction_repo.get_all()
        recent_txs = all_txs[:10]

        # 3. Construct Context Object
        context = {
            "accounts": [acc.model_dump() for acc in accounts],
            "recent_transactions": [tx.model_dump() for tx in recent_txs],
            "company_info": {
                "name": "Toro Group Financial",
                "mission": "Empoderar a nuestros clientes con soluciones financieras ágiles y transparentes.",
                "vision": "Ser el referente en gestión financiera digital en Latinoamérica."
            }
        }
        return json.dumps(context, default=str)

    async def chat(self, user_message: str) -> str:
        # 1. Build System Prompt
        context_str = await self.get_financial_context()
        
        system_prompt = f"""
        Eres el 'Profesor Toro', un asesor financiero experto y amigable de la plataforma Toro Group. 
        Tu objetivo es ayudar al usuario a entender sus finanzas basándote EXCLUSIVAMENTE en los siguientes datos proporcionados.
        
        DATOS DE LA CUENTA (CONTEXTO):
        {context_str}

        REGLAS:
        1. Responde de manera concisa y profesional pero cálida.
        2. Si te preguntan por balances, transacciones o estado de cuenta, usa los datos del JSON anterior.
        3. Si te preguntan algo fuera de este contexto (ej. clima, deportes), responde amablemente que solo puedes asesorar sobre la cuenta financiera en Toro Group.
        4. No inventes transacciones. Si no hay datos, dilo.
        5. Usa formato Markdown simple (negritas, listas) para mejorar la legibilidad.
        """

        # 2. Call Gemini
        response = self.client.generate_response(system_prompt, user_message)
        return response

advisor_service = AdvisorService()
