import logging
import json
import io
from app.core.logger import get_logger

def test_json_logging():
    # Capture stdout
    stream = io.StringIO()
    handler = logging.StreamHandler(stream)
    
    # Get logger and replace handlers for testing
    logger = get_logger("test_logger")
    # We need to ensure we use the same formatter as in production
    from pythonjsonlogger import json as json_logger
    formatter = json_logger.JsonFormatter(
        "%(asctime)s %(name)s %(levelname)s %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S%z"
    )
    handler.setFormatter(formatter)
    
    # Clear existing handlers to avoid pollution
    logger.handlers = []
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    
    # Log a message
    logger.info("Test message", extra={"custom_field": "value"})
    
    # Get output
    output = stream.getvalue()
    
    # Verify it's valid JSON
    try:
        log_entry = json.loads(output)
    except json.JSONDecodeError:
        assert False, f"Output is not valid JSON: {output}"
        
    # Verify fields
    assert log_entry["message"] == "Test message"
    assert log_entry["levelname"] == "INFO"
    assert log_entry["name"] == "test_logger"
    assert log_entry["custom_field"] == "value"
    assert "asctime" in log_entry
