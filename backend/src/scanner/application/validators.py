from typing import List
from src.shared.config.logger import logger

class ImageFileValidator:
    def __init__(self, max_size_mb: int, allowed_types: List[str]):
        self.max_size_bytes = max_size_mb * 1024 * 1024
        self.allowed_types = allowed_types

    async def validate(self, file_content: bytes, filename: str, content_type: str) -> bool:
        """
        Validates file size and MIME type.
        Raises ValueError if invalid.
        """
        size = len(file_content)
        
        if size > self.max_size_bytes:
            logger.warning(f"File {filename} too large: {size} bytes")
            raise ValueError(f"File size exceeds limit of {self.max_size_bytes / 1024 /1024} MB")

        if content_type not in self.allowed_types:
            logger.warning(f"Invalid content type: {content_type}")
            raise ValueError(f"File type {content_type} not allowed. Allowed: {self.allowed_types}")

        return True
