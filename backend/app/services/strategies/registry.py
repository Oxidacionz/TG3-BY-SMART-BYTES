import logging
from .base import BaseStrategy
from .venezuela import BancoVenezuelaStrategy
from .banesco import BanescoStrategy
from .mercantil import MercantilStrategy
from .bancamiga import BancamigaStrategy
from .classifier import TransactionClassifier, Bank, TransactionType

logger = logging.getLogger(__name__)

# Map (Bank, TransactionType) -> Strategy Instance
STRATEGY_MAP = {
    (Bank.VENEZUELA, TransactionType.MOBILE_PAYMENT): BancoVenezuelaStrategy(),
    (Bank.BANESCO, TransactionType.MOBILE_PAYMENT): BanescoStrategy(),
    (Bank.MERCANTIL, TransactionType.MOBILE_PAYMENT): MercantilStrategy(),
    (Bank.BANCAMIGA, TransactionType.MOBILE_PAYMENT): BancamigaStrategy(),
    # Future: Add TRANSFER strategies here
}

def select_strategy_by_text(text: str) -> BaseStrategy:
    """
    Selects the appropriate parsing strategy based on text classification.
    """
    if not text:
        return BaseStrategy()

    # 1. Classify the text
    bank, tx_type = TransactionClassifier.classify(text)
    
    logger.info(f"Classified receipt: Bank={bank.value}, Type={tx_type.value}")

    # 2. Lookup strategy in the map
    strategy = STRATEGY_MAP.get((bank, tx_type))

    if strategy:
        return strategy

    # 3. Fallback: If we identified the bank but not the specific type (or no mapping exists),
    # we could try to return a default strategy for that bank if available, 
    # or just log a warning and return BaseStrategy.
    
    # For now, if we have a Bank but no specific strategy map (e.g. TRANSFER), 
    # we might want to fallback to the Mobile strategy of that bank if it's robust enough,
    # or just BaseStrategy. 
    
    logger.warning(f"No specific strategy found for ({bank}, {tx_type}). Using BaseStrategy.")
    return BaseStrategy()
