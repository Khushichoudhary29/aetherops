import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "AetherOps Control Center"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    SANDBOX_TIMEOUT_SECONDS: int = 15
    ALLOW_ORIGINS: list[str] = ["*"]

settings = Settings()
