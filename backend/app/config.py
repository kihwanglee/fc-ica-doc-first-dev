"""애플리케이션 설정 모듈"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """환경 변수 기반 애플리케이션 설정"""

    # 데이터베이스
    DATABASE_URL: str = "postgresql+asyncpg://taskflow:taskflow1234@db:5432/taskflow"

    # JWT 인증
    JWT_SECRET: str = "your-super-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
