
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from src.scanner.application.parsers import ReceiptDataMapper
from src.transactions.domain.transaction import Transaction

mapper = ReceiptDataMapper()
raw_data = {
    "platform": "BANESCO",
    "amount": 100.0,
    "currency": "VES",
    "reference_id": "123456",
    "transaction_date": "2024-01-01 10:00:00",
    "sender_name": "Test",
    "receiver_name": "Test"
}

try:
    tx = mapper.to_domain(raw_data)
    print(f"Success: {tx}")
except Exception as e:
    print(f"Error: {e}")
