from abc import ABC, abstractmethod
from typing import Any, Optional
from cachetools import TTLCache
from app.core.config import settings
from app.core.logger import get_logger

logger = get_logger(__name__)

class CacheStorage(ABC):
    @abstractmethod
    def get(self, key: str) -> Optional[Any]:
        pass

    @abstractmethod
    def set(self, key: str, value: Any) -> None:
        pass

class InMemoryCacheStorage(CacheStorage):
    _instance = None
    _cache = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(InMemoryCacheStorage, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        if settings.CACHE_ENABLED:
            self._cache = TTLCache(maxsize=settings.CACHE_MAXSIZE, ttl=settings.CACHE_TTL)
            logger.info(f"InMemoryCacheStorage initialized: TTL={settings.CACHE_TTL}s, MaxSize={settings.CACHE_MAXSIZE}")
        else:
            self._cache = None
            logger.info("InMemoryCacheStorage disabled via config.")

    def get(self, key: str) -> Optional[Any]:
        if self._cache is not None:
            return self._cache.get(key)
        return None

    def set(self, key: str, value: Any) -> None:
        if self._cache is not None:
            self._cache[key] = value

    def clear(self):
        """Helper for testing"""
        if self._cache is not None:
            self._cache.clear()
