from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.models.finance import Account, CashSession
from decimal import Decimal
from datetime import datetime

class AccountBookService:
    def __init__(self, db: Session):
        self.db = db

    def register_transaction(self, tx_data: dict):
        """
        Registra una transacción aplicando la lógica del Libro de Cuentas:
        - Validación de Sesión
        - Conversión de Moneda
        - Afectación de Saldos (Efecto inmediato si no es PENDING)
        """
        
        # 1. Validar Sesión (Si se proporciona)
        session_id = tx_data.get('session_id')
        if session_id:
            cash_session = self.db.query(CashSession).filter(CashSession.id == session_id).first()
            if not cash_session:
                raise ValueError("Session ID provided not found.")
            if cash_session.status != 'OPEN':
                raise ValueError(f"Cannot register transaction in a {cash_session.status} session.")
        
        # 2. Cálculos de Moneda y Tasas
        currency = tx_data.get('currency', 'USD')
        amount = Decimal(str(tx_data.get('amount', 0)))
        exchange_rate = Decimal(str(tx_data.get('exchange_rate', 1.0)))
        
        amount_usd = Decimal(0)
        
        if currency == 'VES':
            # Convertir a USD para referencia
            # amount (VES) / rate (VES/USD) = amount_usd
            amount_usd = amount / exchange_rate if exchange_rate > 0 else Decimal(0)
        else:
            # Es USD (u otra divisa base)
            amount_usd = amount
            # Nota: Si se requiriera 'native_equivalent' en VES, sería amount * rate.
            # Por ahora el modelo Transaction tiene amount y currency, y amount_usd.
        
        # 3. Comisiones (Simplificado)
        commission = Decimal(str(tx_data.get('commission_amount', 0)))
        tax = Decimal(str(tx_data.get('tax_amount', 0)))
        net_amount = amount - commission - tax
        
        # 4. Crear Instancia de Transacción
        new_tx = Transaction(
            platform=tx_data.get('platform'),
            amount=amount,
            currency=currency,
            category=tx_data.get('category'),
            transaction_type=tx_data.get('transaction_type', 'ENTRADA'),
            status=tx_data.get('status', 'PENDING'),
            exchange_rate=exchange_rate,
            amount_usd=amount_usd,
            tax_amount=tax,
            commission_amount=commission,
            net_amount=net_amount,
            account_id=tx_data.get('account_id'),
            session_id=session_id,
            branch_id=tx_data.get('branch_id'),
            reference_id=tx_data.get('reference_id'),
            transaction_date=tx_data.get('transaction_date') or datetime.utcnow(),
            sender_name=tx_data.get('sender_name'),
            receiver_name=tx_data.get('receiver_name'),
            evidence_url=tx_data.get('evidence_url')
        )
        
        # 5. Afectación de Saldos (Logic Trigger)
        # Solo afectar si NO es pending (o si es 'COMPLETED')
        if new_tx.status == 'COMPLETED':
            self._update_balances(new_tx)
            
        self.db.add(new_tx)
        self.db.commit()
        self.db.refresh(new_tx)
        
        return new_tx

    def update_transaction_status(self, transaction_id: str, new_status: str):
        """
        Actualiza el estado de una transacción y ajusta saldos si cambia a COMPLETED.
        """
        tx = self.db.query(Transaction).get(transaction_id)
        if not tx:
            raise ValueError("Transaction not found")
        
        old_status = tx.status
        tx.status = new_status
        
        # Si transiciona de NO pagado a PAGADO, actualizar saldos
        if old_status != 'COMPLETED' and new_status == 'COMPLETED':
            self._update_balances(tx)
            
        self.db.commit()
        return tx

    def _update_balances(self, tx: Transaction):
        """
        Actualiza los saldos de Cuenta y Sesión basado en el tipo de transacción.
        """
        # Actualizar Cuenta (Account)
        if tx.account_id:
            account = self.db.query(Account).get(tx.account_id)
            if account:
                if tx.transaction_type == 'ENTRADA':
                    account.current_balance += tx.net_amount
                elif tx.transaction_type == 'SALIDA':
                    account.current_balance -= tx.net_amount
        
        # Actualizar Sesión (CashSession)
        # Nota: Normalmente solo transacciones de efectivo (CASH) afectan la sesión de caja,
        # pero esto depende de la regla de negocio. Asumiremos que si tiene session_id, afecta.
        if tx.session_id:
            session = self.db.query(CashSession).get(tx.session_id)
            if session:
                # OJO: La sesión suele trackear flujo de efectivo. 
                # Si la tx fue en ZELLE pero asociada a la sesion, ¿suma al "arqueo" de caja? 
                # Usualmente no, solo efectivo. 
                # Pero seguiremos la lógica simple: si está en sesión, suma/resta.
                # Se puede refinar validando account.type == 'CASH'.
                
                if tx.transaction_type == 'ENTRADA':
                    session.current_balance += tx.net_amount
                elif tx.transaction_type == 'SALIDA':
                    session.current_balance -= tx.net_amount
