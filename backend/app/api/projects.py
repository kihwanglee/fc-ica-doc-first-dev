"""프로젝트 API 라우터: CRUD, 멤버 관리"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.project import Project, ProjectMember
from app.models.task import Task
from app.models.user import User
from app.schemas.project import (
    MemberAdd,
    MemberAddResponse,
    MemberResponse,
    ProjectCreate,
    ProjectDetailResponse,
    ProjectListItem,
    ProjectListResponse,
    ProjectResponse,
    ProjectUpdate,
    TaskSummary,
)
from app.utils.auth import get_current_user

router = APIRouter(prefix="/projects", tags=["projects"])


# ────────────────────────────────────────────
# 헬퍼 함수
# ────────────────────────────────────────────


async def _get_project_or_404(
    project_id: uuid.UUID, db: AsyncSession
) -> Project:
    """프로젝트를 조회하고, 없거나 삭제됐으면 404를 반환한다."""
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.is_deleted == False)  # noqa: E712
    )
    project = result.scalar_one_or_none()
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프로젝트를 찾을 수 없습니다",
        )
    return project


async def _check_membership(
    project_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession
) -> ProjectMember:
    """사용자가 프로젝트 멤버인지 확인하고, 아니면 403을 반환한다."""
    result = await db.execute(
        select(ProjectMember).where(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == user_id,
        )
    )
    member = result.scalar_one_or_none()
    if member is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="이 프로젝트에 접근할 권한이 없습니다",
        )
    return member


async def _check_owner(
    project_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession
) -> ProjectMember:
    """사용자가 프로젝트 소유자인지 확인하고, 아니면 403을 반환한다."""
    member = await _check_membership(project_id, user_id, db)
    if member.role != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="프로젝트 소유자만 수행할 수 있습니다",
        )
    return member


# ────────────────────────────────────────────
# 프로젝트 CRUD
# ────────────────────────────────────────────


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_project(
    body: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """프로젝트를 생성한다. 생성자는 자동으로 owner 멤버가 된다."""
    project = Project(
        name=body.name,
        description=body.description,
        owner_id=current_user.id,
    )
    db.add(project)
    await db.flush()

    # 생성자를 owner 멤버로 추가
    member = ProjectMember(
        project_id=project.id,
        user_id=current_user.id,
        role="owner",
    )
    db.add(member)
    await db.flush()
    await db.refresh(project)

    return {
        "status": "success",
        "data": ProjectResponse.model_validate(project).model_dump(),
        "message": None,
    }


@router.get("")
async def list_projects(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """현재 사용자가 멤버인 프로젝트 목록을 조회한다."""

    # 사용자가 속한 프로젝트 ID 목록
    member_subq = (
        select(ProjectMember.project_id)
        .where(ProjectMember.user_id == current_user.id)
        .subquery()
    )

    # 총 개수
    count_stmt = select(func.count()).select_from(
        select(Project.id)
        .where(Project.id.in_(select(member_subq.c.project_id)), Project.is_deleted == False)  # noqa: E712
        .subquery()
    )
    total = (await db.execute(count_stmt)).scalar() or 0

    # 프로젝트 목록
    stmt = (
        select(Project)
        .where(Project.id.in_(select(member_subq.c.project_id)), Project.is_deleted == False)  # noqa: E712
        .order_by(Project.created_at.desc())
        .offset((page - 1) * size)
        .limit(size)
    )
    result = await db.execute(stmt)
    projects = result.scalars().all()

    items: list[dict] = []
    for p in projects:
        # 멤버 수
        mc_result = await db.execute(
            select(func.count()).where(ProjectMember.project_id == p.id)
        )
        member_count = mc_result.scalar() or 0

        # 태스크 요약
        task_counts: dict[str, int] = {"todo": 0, "in_progress": 0, "done": 0}
        for s in ["TODO", "IN_PROGRESS", "DONE"]:
            tc_result = await db.execute(
                select(func.count()).where(
                    Task.project_id == p.id,
                    Task.status == s,
                    Task.is_deleted == False,  # noqa: E712
                )
            )
            key = s.lower()
            task_counts[key] = tc_result.scalar() or 0

        items.append(
            ProjectListItem(
                id=p.id,
                name=p.name,
                description=p.description,
                owner_id=p.owner_id,
                member_count=member_count,
                task_summary=TaskSummary(**task_counts),
                created_at=p.created_at,
                updated_at=p.updated_at,
            ).model_dump()
        )

    return {
        "status": "success",
        "data": ProjectListResponse(
            items=[ProjectListItem(**i) for i in items],
            total=total,
            page=page,
            size=size,
        ).model_dump(),
        "message": None,
    }


@router.get("/{project_id}")
async def get_project(
    project_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """프로젝트 상세 정보를 조회한다."""
    project = await _get_project_or_404(project_id, db)
    await _check_membership(project_id, current_user.id, db)

    # 멤버 목록 조회
    result = await db.execute(
        select(ProjectMember)
        .options(selectinload(ProjectMember.user))
        .where(ProjectMember.project_id == project_id)
    )
    members_rows = result.scalars().all()

    members = [
        MemberResponse(
            id=m.user.id,
            name=m.user.name,
            email=m.user.email,
            role=m.role,
            joined_at=m.joined_at,
        )
        for m in members_rows
    ]

    return {
        "status": "success",
        "data": ProjectDetailResponse(
            id=project.id,
            name=project.name,
            description=project.description,
            owner_id=project.owner_id,
            members=members,
            created_at=project.created_at,
            updated_at=project.updated_at,
        ).model_dump(),
        "message": None,
    }


@router.patch("/{project_id}")
async def update_project(
    project_id: uuid.UUID,
    body: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """프로젝트 정보를 수정한다. (소유자만)"""
    project = await _get_project_or_404(project_id, db)
    await _check_owner(project_id, current_user.id, db)

    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    await db.flush()
    await db.refresh(project)

    return {
        "status": "success",
        "data": ProjectResponse.model_validate(project).model_dump(),
        "message": None,
    }


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """프로젝트를 소프트 삭제한다. (소유자만)"""
    project = await _get_project_or_404(project_id, db)
    await _check_owner(project_id, current_user.id, db)

    project.is_deleted = True
    await db.flush()
    return None


# ────────────────────────────────────────────
# 멤버 관리
# ────────────────────────────────────────────


@router.post("/{project_id}/members", status_code=status.HTTP_201_CREATED)
async def add_member(
    project_id: uuid.UUID,
    body: MemberAdd,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """프로젝트에 멤버를 추가한다. (소유자만)"""
    await _get_project_or_404(project_id, db)
    await _check_owner(project_id, current_user.id, db)

    # 이메일로 사용자 조회
    result = await db.execute(select(User).where(User.email == body.email))
    target_user = result.scalar_one_or_none()
    if target_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="가입된 사용자가 아닙니다",
        )

    # 이미 멤버인지 확인
    result = await db.execute(
        select(ProjectMember).where(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == target_user.id,
        )
    )
    if result.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 프로젝트 멤버입니다",
        )

    member = ProjectMember(
        project_id=project_id,
        user_id=target_user.id,
        role="member",
    )
    db.add(member)
    await db.flush()
    await db.refresh(member)

    return {
        "status": "success",
        "data": MemberAddResponse(
            project_id=member.project_id,
            user_id=member.user_id,
            role=member.role,
            joined_at=member.joined_at,
        ).model_dump(),
        "message": None,
    }


@router.get("/{project_id}/members")
async def list_members(
    project_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """프로젝트 멤버 목록을 조회한다."""
    await _get_project_or_404(project_id, db)
    await _check_membership(project_id, current_user.id, db)

    result = await db.execute(
        select(ProjectMember)
        .options(selectinload(ProjectMember.user))
        .where(ProjectMember.project_id == project_id)
    )
    members_rows = result.scalars().all()

    members = [
        MemberResponse(
            id=m.user.id,
            name=m.user.name,
            email=m.user.email,
            role=m.role,
            joined_at=m.joined_at,
        ).model_dump()
        for m in members_rows
    ]

    return {
        "status": "success",
        "data": members,
        "message": None,
    }
