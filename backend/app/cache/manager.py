from typing import Any, Optional
from app.cache.hashing import HashStrategy, SHA256HashStrategy
from app.cache.storage import CacheStorage, InMemoryCacheStorage

class CacheManager:
    def __init__(
        self,
        hash_strategy: HashStrategy = SHA256HashStrategy(),
        storage: CacheStorage = InMemoryCacheStorage()
    ):
        self.hash_strategy = hash_strategy
        self.storage = storage

    def get(self, content: bytes) -> Optional[Any]:
        key = self.hash_strategy.compute_hash(content)
        return self.storage.get(key)

    def set(self, content: bytes, value: Any) -> None:
        key = self.hash_strategy.compute_hash(content)
        self.storage.set(key, value)
