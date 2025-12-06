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
    USE_MOCK_DB: bool = False
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
