from typing import Dict, Any, List
from app.services.interfaces import INormalizationService, INormalizationRule

class NormalizationService(INormalizationService):
    def __init__(self, rules: List[INormalizationRule]):
        self.rules = rules

    def normalize(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalizes the data dictionary in place using registered rules.
        """
        for rule in self.rules:
            rule.apply(data)
        return data
