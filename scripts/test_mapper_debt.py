
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from src.scanner.application.parsers import ReceiptDataMapper
from src.transactions.domain.transaction import TransactionStatus, TransactionType

mapper = ReceiptDataMapper()

test_cases = [
    {
        "name": "Zelle Input but Debt (We owe VES)",
        "input": {
            "platform": "ZELLE",
            "amount": 100.0,
            "currency": "USD",
            "transaction_type": "ENTRADA",
            "category": "CAMBIO_DIVISAS",
            "payment_status": "DEUDA_POR_PAGAR",
            "reference_number": "REF123",
            "is_partial": True
        },
        "expected_status": TransactionStatus.PENDING_DELIVERY
    },
    {
        "name": "Provider Payment but Debt (They owe us service/goods)",
        "input": {
            "platform": "BANESCO",
            "amount": 5000.0,
            "currency": "VES",
            "transaction_type": "SALIDA",
            "category": "PAGO_PROVEEDOR",
            "payment_status": "DEUDA_POR_COBRAR",
            "reference_number": "REF456",
            "is_partial": True
        },
        "expected_status": TransactionStatus.ACCOUNTS_RECEIVABLE
    },
    {
        "name": "Standard Sale (Complete)",
        "input": {
            "platform": "PAGO_MOVIL",
            "amount": 50.0,
            "currency": "VES",
            "transaction_type": "ENTRADA",
            "category": "VENTA",
            "payment_status": "COMPLETO",
            "reference_number": "REF789",
            "is_partial": False
        },
        "expected_status": TransactionStatus.COMPLETED
    }
]

print("=== Running Mapper Tests ===")
failed = False
for case in test_cases:
    print(f"Testing: {case['name']}...")
    try:
        tx = mapper.to_domain(case['input'])
        if tx.status == case['expected_status']:
            print(f"  ✅ PASS: Status is {tx.status}")
        else:
            print(f"  ❌ FAIL: Expected {case['expected_status']}, got {tx.status}")
            failed = True
    except Exception as e:
        print(f"  ❌ FAIL: Exception {e}")
        failed = True

if not failed:
    print("\n🎉 All tests passed!")
else:
    print("\n⚠️ Some tests failed.")
