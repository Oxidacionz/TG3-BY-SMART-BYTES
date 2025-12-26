from sqlalchemy.orm import Session
from app.core.database_sb import SessionLocal
from app.models.finance import Account, CashSession
from src.finance.domain.schemas import AccountDTO, SessionDTO

class FinanceRepository:
    def get_accounts(self) -> list[AccountDTO]:
        db = SessionLocal()
        try:
            accounts = db.query(Account).all()
            return [
                AccountDTO(
                    id=acc.id,
                    name=acc.name,
                    type=acc.type,
                    currency=acc.currency,
                    current_balance=float(acc.current_balance or 0),
                    branch_id=acc.branch_id or "MAIN"
                ) for acc in accounts
            ]
        finally:
            db.close()

    def get_sessions(self) -> list[SessionDTO]:
        db = SessionLocal()
        try:
            sessions = db.query(CashSession).all()
            return [
                SessionDTO(
                    id=s.id,
                    user_id=s.user_id,
                    status=s.status,
                    initial_balance=float(s.initial_balance or 0),
                    current_balance=float(s.current_balance or 0)
                ) for s in sessions
            ]
        finally:
            db.close()

finance_repo = FinanceRepository()
