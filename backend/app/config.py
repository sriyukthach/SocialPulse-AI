import os
import certifi
from pathlib import Path
from pydantic_settings import BaseSettings

# Ensure SSL certificates are properly referenced
if not os.getenv("SSL_CERT_FILE"):
    os.environ["SSL_CERT_FILE"] = certifi.where()
if not os.getenv("REQUESTS_CA_BUNDLE"):
    os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    HINDSIGHT_BASE_URL: str = "https://api.hindsight.vectorize.io"
    HINDSIGHT_API_KEY: str = ""
    DATABASE_URL: str = f"sqlite:///{BASE_DIR}/socialpulse.db"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    GEMINI_MODEL: str = "gemini-2.5-flash"

    class Config:
        env_file = BASE_DIR / ".env"
        extra = "ignore"

settings = Settings()
