"""
Response parsing services implementing IResponseParser interface.
Handles parsing and cleaning of AI/OCR service responses.

Following Single Responsibility Principle: Only parses responses.
"""
import json
import re
from typing import Dict, Any
from app.core.interfaces import IResponseParser
from app.core.logger import get_logger

logger = get_logger(__name__)


class GeminiResponseParser(IResponseParser):
    """
    Parser for Google Gemini AI responses.
    Handles JSON extraction from markdown-wrapped responses.
    """
    
    REQUIRED_FIELDS = ["platform", "amount", "currency"]
    
    def parse_response(self, raw_response: str) -> Dict[str, Any]:
        """
        Parse Gemini response text to structured data.
        
        Args:
            raw_response: Raw text from Gemini API
            
        Returns:
            Parsed data dictionary
            
        Raises:
            ValueError: If parsing fails
        """
        try:
            # Extract JSON from response
            json_str = self.extract_json(raw_response)
            
            # Parse JSON
            data = json.loads(json_str)
            
            # Validate structure
            if not self.validate_response_structure(data):
                raise ValueError(f"Response missing required fields: {self.REQUIRED_FIELDS}")
            
            logger.info(f"Successfully parsed Gemini response: platform={data.get('platform')}")
            return data
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}. Raw text: {raw_response[:200]}")
            raise ValueError(f"Failed to parse JSON from Gemini response: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected parsing error: {e}")
            raise ValueError(f"Error parsing Gemini response: {str(e)}")
    
    def extract_json(self, text: str) -> str:
        """
        Extract JSON from text, removing markdown code blocks and other artifacts.
        
        Args:
            text: Text containing JSON
            
        Returns:
            Clean JSON string
        """
        # Remove leading/trailing whitespace
        cleaned = text.strip()
        
        # Remove markdown code blocks
        cleaned = re.sub(r'```json\s*', '', cleaned)
        cleaned = re.sub(r'```\s*', '', cleaned)
        
        # Find first { and last }
        first_brace = cleaned.find('{')
        last_brace = cleaned.rfind('}')
        
        if first_brace >= 0 and last_brace > first_brace:
            cleaned = cleaned[first_brace:last_brace + 1]
        else:
            # Try to find JSON array
            first_bracket = cleaned.find('[')
            last_bracket = cleaned.rfind(']')
            if first_bracket >= 0 and last_bracket > first_bracket:
                cleaned = cleaned[first_bracket:last_bracket + 1]
        
        return cleaned
    
    def validate_response_structure(self, data: Dict[str, Any]) -> bool:
        """
        Validate that response has required fields.
        
        Args:
            data: Parsed response data
            
        Returns:
            True if all required fields present
        """
        if not isinstance(data, dict):
            return False
        
        # Check required fields
        for field in self.REQUIRED_FIELDS:
            if field not in data:
                logger.warning(f"Missing required field: {field}")
                return False
        
        # Validate amount is present and not None
        if data.get("amount") is None:
            logger.warning("Amount field is None")
            return False
        
        return True


class TesseractResponseParser(IResponseParser):
    """
    Parser for Tesseract OCR responses.
    Handles raw text extraction and pattern matching.
    """
    
    def parse_response(self, raw_response: str) -> Dict[str, Any]:
        """
        Parse Tesseract OCR text to structured data.
        
        Args:
            raw_response: Raw OCR text
            
        Returns:
            Parsed data dictionary
        """
        # For Tesseract, we expect structured text or use pattern matching
        # This is a simplified implementation
        data = {
            "platform": "UNKNOWN",
            "amount": 0.0,
            "currency": "VES",
            "raw_text_snippet": raw_response[:200]
        }
        
        # Pattern matching for common receipt formats
        # Amount patterns: Bs. 1.234,56 or $1,234.56
        amount_patterns = [
            r'Bs\.?\s*([\d,\.]+)',
            r'\$\s*([\d,\.]+)',
            r'Monto:?\s*([\d,\.]+)',
            r'Total:?\s*([\d,\.]+)'
        ]
        
        for pattern in amount_patterns:
            match = re.search(pattern, raw_response, re.IGNORECASE)
            if match:
                amount_str = match.group(1).replace(',', '')
                try:
                    data["amount"] = float(amount_str)
                    break
                except ValueError:
                    continue
        
        return data
    
    def extract_json(self, text: str) -> str:
        """Not used for Tesseract - returns text as-is."""
        return text
    
    def validate_response_structure(self, data: Dict[str, Any]) -> bool:
        """Validate Tesseract parsed data."""
        return isinstance(data, dict) and "amount" in data


# Singleton instances
gemini_parser = GeminiResponseParser()
tesseract_parser = TesseractResponseParser()
