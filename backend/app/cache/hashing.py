import hashlib
from abc import ABC, abstractmethod

class HashStrategy(ABC):
    @abstractmethod
    def compute_hash(self, content: bytes) -> str:
        """Computes a hash for the given content."""
        pass

class SHA256HashStrategy(HashStrategy):
    def compute_hash(self, content: bytes) -> str:
        return hashlib.sha256(content).hexdigest()
