import unittest
from unittest.mock import MagicMock
from app.services.normalization_service import NormalizationService
from app.services.interfaces import INormalizationRule
from app.services.normalization_rules import (
    DateNormalizationRule, 
    IdentificationNormalizationRule, 
    AmountNormalizationRule
)

class TestNormalizationRules(unittest.TestCase):
    def test_date_rule(self):
        rule = DateNormalizationRule()
        
        # Standard case
        data = {"date": "30/11/25"}
        rule.apply(data)
        self.assertEqual(data["date"], "30/11/2025")
        
        # Single digits
        data = {"date": "1/1/25"}
        rule.apply(data)
        self.assertEqual(data["date"], "01/01/2025")
        
        # Hyphens
        data = {"date": "30-11-25"}
        rule.apply(data)
        self.assertEqual(data["date"], "30/11/2025")

    def test_identification_rule(self):
        rule = IdentificationNormalizationRule()
        
        # Standard V-
        data = {"identification": "V-12.345.678"}
        rule.apply(data)
        self.assertEqual(data["identification"], "12345678")
        
        # J- with suffix
        data = {"identification": "J-12345678-0"}
        rule.apply(data)
        self.assertEqual(data["identification"], "123456780")
        
        # Spaces
        data = {"identification": "V 12 345 678"}
        rule.apply(data)
        self.assertEqual(data["identification"], "12345678")

    def test_amount_rule(self):
        rule = AmountNormalizationRule()
        
        # Suffix
        data = {"amount": "60,00 Bs"}
        rule.apply(data)
        self.assertEqual(data["amount"], "60,00")
        
        # Prefix
        data = {"amount": "Bs. 1.500,00"}
        rule.apply(data)
        self.assertEqual(data["amount"], "1.500,00")
        
        # Clean
        data = {"amount": "1.234,56"}
        rule.apply(data)
        self.assertEqual(data["amount"], "1.234,56")

class TestNormalizationService(unittest.TestCase):
    def test_service_delegation(self):
        """Test that the service correctly delegates to injected rules."""
        mock_rule = MagicMock(spec=INormalizationRule)
        service = NormalizationService([mock_rule])
        
        data = {"key": "value"}
        service.normalize(data)
        
        # Verify the rule was called with the data
        mock_rule.apply.assert_called_once_with(data)

    def test_integration_all_rules(self):
        """Test the service with actual rules wired up."""
        rules = [
            DateNormalizationRule(),
            IdentificationNormalizationRule(),
            AmountNormalizationRule()
        ]
        service = NormalizationService(rules)
        
        data = {
            "date": "30/11/25",
            "identification": "V-12.345.678",
            "amount": "60,00 Bs",
            "other": "value"
        }
        normalized = service.normalize(data)
        
        self.assertEqual(normalized["date"], "30/11/2025")
        self.assertEqual(normalized["identification"], "12345678")
        self.assertEqual(normalized["amount"], "60,00")
        self.assertEqual(normalized["other"], "value")

if __name__ == '__main__':
    unittest.main()
