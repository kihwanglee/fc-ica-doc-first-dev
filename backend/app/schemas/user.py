"""사용자 관련 Pydantic 스키마"""

import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """회원가입 요청"""
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=100)


class UserLogin(BaseModel):
    """로그인 요청"""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """사용자 정보 응답"""
    id: uuid.UUID
    email: str
    name: str
    created_at: datetime

    model_config = {"from_attributes": True}


class UserBrief(BaseModel):
    """사용자 간략 정보 (태스크 담당자/생성자용)"""
    id: uuid.UUID
    name: str

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    """인증 토큰 응답"""
    user: UserResponse
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
