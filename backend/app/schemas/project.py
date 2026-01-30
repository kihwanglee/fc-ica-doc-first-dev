"""프로젝트 관련 Pydantic 스키마"""

import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class ProjectCreate(BaseModel):
    """프로젝트 생성 요청"""
    name: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)


class ProjectUpdate(BaseModel):
    """프로젝트 수정 요청"""
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)


class ProjectResponse(BaseModel):
    """프로젝트 응답"""
    id: uuid.UUID
    name: str
    description: str | None
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class MemberResponse(BaseModel):
    """멤버 정보 응답"""
    id: uuid.UUID
    name: str
    email: str
    role: str
    joined_at: datetime | None = None

    model_config = {"from_attributes": True}


class ProjectDetailResponse(BaseModel):
    """프로젝트 상세 응답 (멤버 포함)"""
    id: uuid.UUID
    name: str
    description: str | None
    owner_id: uuid.UUID
    members: list[MemberResponse]
    created_at: datetime
    updated_at: datetime


class TaskSummary(BaseModel):
    """태스크 요약 (프로젝트 목록용)"""
    todo: int = 0
    in_progress: int = 0
    done: int = 0


class ProjectListItem(BaseModel):
    """프로젝트 목록 항목"""
    id: uuid.UUID
    name: str
    description: str | None
    owner_id: uuid.UUID
    member_count: int
    task_summary: TaskSummary
    created_at: datetime
    updated_at: datetime


class ProjectListResponse(BaseModel):
    """프로젝트 목록 응답 (페이지네이션)"""
    items: list[ProjectListItem]
    total: int
    page: int
    size: int


class MemberAdd(BaseModel):
    """멤버 추가 요청"""
    email: EmailStr


class MemberAddResponse(BaseModel):
    """멤버 추가 응답"""
    project_id: uuid.UUID
    user_id: uuid.UUID
    role: str
    joined_at: datetime
