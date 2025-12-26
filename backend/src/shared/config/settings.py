from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    MAX_FILE_SIZE_MB: int = 5
    LOG_LEVEL: str = "INFO"
    TESSDATA_DIR: str | None = None
    CACHE_ENABLED: bool = True
    CACHE_TTL: int = 120
    CACHE_MAXSIZE: int = 100
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_DEFAULT: str = "60/minute"
    SENTRY_DSN: str | None = None
    API_KEY: str = "dev-secret-key"
    GEMINI_API_KEY: str | None = None
    GEMINI_KEYS: list[str] = []
    USE_MOCK_DB: bool = False

    # Gemini Scanner Config
    GEMINI_SCANNER_MODEL_NAME: str = "models/gemini-flash-latest"
    GEMINI_SCANNER_TEMPERATURE: float = 0.1
    GEMINI_SCANNER_MAX_OUTPUT_TOKENS: int = 1024
    GEMINI_SCANNER_MAX_RETRIES: int = 3
    GEMINI_SCANNER_MAX_FILE_SIZE_MB: int = 5
    GEMINI_SCANNER_ALLOWED_MIME_TYPES: list[str] = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
    
    @property
    def parsed_api_keys(self) -> list[str]:
        return self.GEMINI_KEYS
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    def model_post_init(self, __context):
        # Load keys from file if exists
        import os
        keys_file = "GEMINI_API_KEYS.txt"
        # Check in root or parent
        paths = [keys_file, f"../{keys_file}", f"../../{keys_file}"]
        
        for path in paths:
            if os.path.exists(path):
                try:
                    with open(path, "r") as f:
                        lines = f.readlines()
                        for line in lines:
                            line = line.strip()
                            # Ignore comments and empty lines
                            if not line or line.startswith("#"):
                                continue
                            # Extract key (remove "1. " prefix if present)
                            parts = line.split(" ")
                            # Find the first part that looks like a key (starts with AIza)
                            key_candidate = None
                            for part in parts:
                                part = part.strip()
                                if part.startswith("AIza"):
                                    key_candidate = part
                                    break
                            
                            if key_candidate:
                                self.GEMINI_KEYS.append(key_candidate)
                except Exception as e:
                    print(f"Error loading keys from {path}: {e}")
                break
        
        # If no keys in file, try env var
        if not self.GEMINI_KEYS and self.GEMINI_API_KEY:
            self.GEMINI_KEYS.append(self.GEMINI_API_KEY)

settings = Settings()
