"""태스크 관련 Pydantic 스키마"""

import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field

from app.schemas.user import UserBrief


class TaskStatus(str, Enum):
    """태스크 상태"""
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"


class TaskPriority(str, Enum):
    """태스크 우선순위"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"


class TaskCreate(BaseModel):
    """태스크 생성 요청"""
    title: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    assignee_id: uuid.UUID | None = None


class TaskUpdate(BaseModel):
    """태스크 수정 요청 (부분 수정)"""
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    assignee_id: uuid.UUID | None = None
    position: int | None = Field(default=None, ge=0)


class TaskResponse(BaseModel):
    """태스크 응답"""
    id: uuid.UUID
    project_id: uuid.UUID
    title: str
    description: str | None
    status: str
    priority: str
    position: int
    assignee: UserBrief | None = None
    created_by: UserBrief | None = None
    created_at: datetime
    updated_at: datetime


class TaskListResponse(BaseModel):
    """태스크 목록 응답 (페이지네이션)"""
    items: list[TaskResponse]
    total: int
    page: int
    size: int
