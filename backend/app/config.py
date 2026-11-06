import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from backend root or parent
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    HINDSIGHT_BASE_URL: str = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io").strip()
    HINDSIGHT_API_KEY: str = os.getenv("HINDSIGHT_API_KEY", "").strip()
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    @property
    def is_hindsight_configured(self) -> bool:
        """
        Returns True only if Hindsight API Key is present and non-empty.
        Otherwise, backend runs in Demo Memory Mode (fictional seed store).
        """
        return bool(self.HINDSIGHT_API_KEY)

settings = Settings()
