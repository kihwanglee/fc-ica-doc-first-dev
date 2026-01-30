"""TaskFlow 백엔드 애플리케이션 진입점"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.api.auth import router as auth_router
from app.api.projects import router as projects_router
from app.api.tasks import router as tasks_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 시작 시 DB 테이블을 생성한다."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="TaskFlow API",
    description="태스크 관리 SaaS 백엔드 API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(projects_router, prefix="/api/v1", tags=["Projects"])
app.include_router(tasks_router, prefix="/api/v1", tags=["Tasks"])


@app.get("/health")
async def health_check():
    return {"status": "ok"}
