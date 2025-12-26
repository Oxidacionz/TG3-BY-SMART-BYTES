import logging
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')
from pythonjsonlogger import json
from src.shared.config.settings import settings

def get_logger(name: str):
    logger = logging.getLogger(name)
    logger.setLevel(settings.LOG_LEVEL)
    
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        # Use JSON Formatter
        formatter = json.JsonFormatter(
            "%(asctime)s %(name)s %(levelname)s %(message)s",
            datefmt="%Y-%m-%dT%H:%M:%S%z"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    return logger

# Global logger for shared usage
logger = get_logger("tg3.core")
