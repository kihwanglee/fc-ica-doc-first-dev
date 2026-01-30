"""태스크 API 라우터: CRUD, 필터링"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.project import Project, ProjectMember
from app.models.task import Task
from app.models.user import User
from app.schemas.task import (
    TaskCreate,
    TaskListResponse,
    TaskResponse,
    TaskStatus,
    TaskPriority,
    TaskUpdate,
)
from app.schemas.user import UserBrief
from app.utils.auth import get_current_user

router = APIRouter(tags=["tasks"])


# ────────────────────────────────────────────
# 헬퍼 함수
# ────────────────────────────────────────────


async def _get_project_or_404(
    project_id: uuid.UUID, db: AsyncSession
) -> Project:
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


async def _build_task_response(task: Task, db: AsyncSession) -> dict:
    """Task 모델을 TaskResponse dict로 변환한다."""
    assignee_data = None
    if task.assignee_id:
        result = await db.execute(select(User).where(User.id == task.assignee_id))
        assignee = result.scalar_one_or_none()
        if assignee:
            assignee_data = UserBrief(id=assignee.id, name=assignee.name)

    creator_data = None
    result = await db.execute(select(User).where(User.id == task.created_by))
    creator = result.scalar_one_or_none()
    if creator:
        creator_data = UserBrief(id=creator.id, name=creator.name)

    return TaskResponse(
        id=task.id,
        project_id=task.project_id,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        position=task.position,
        assignee=assignee_data,
        created_by=creator_data,
        created_at=task.created_at,
        updated_at=task.updated_at,
    ).model_dump()


# ────────────────────────────────────────────
# 태스크 CRUD
# ────────────────────────────────────────────


@router.post(
    "/projects/{project_id}/tasks",
    status_code=status.HTTP_201_CREATED,
)
async def create_task(
    project_id: uuid.UUID,
    body: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """프로젝트에 태스크를 생성한다."""
    await _get_project_or_404(project_id, db)
    await _check_membership(project_id, current_user.id, db)

    # 담당자가 지정된 경우 프로젝트 멤버인지 확인
    if body.assignee_id is not None:
        result = await db.execute(
            select(ProjectMember).where(
                ProjectMember.project_id == project_id,
                ProjectMember.user_id == body.assignee_id,
            )
        )
        if result.scalar_one_or_none() is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="담당자는 프로젝트 멤버여야 합니다",
            )

    # 같은 상태의 최대 position 조회
    pos_result = await db.execute(
        select(func.coalesce(func.max(Task.position), -1)).where(
            Task.project_id == project_id,
            Task.status == body.status.value,
            Task.is_deleted == False,  # noqa: E712
        )
    )
    max_position = pos_result.scalar() or 0
    new_position = max_position + 1

    task = Task(
        project_id=project_id,
        title=body.title,
        description=body.description,
        status=body.status.value,
        priority=body.priority.value,
        position=new_position,
        assignee_id=body.assignee_id,
        created_by=current_user.id,
    )
    db.add(task)
    await db.flush()
    await db.refresh(task)

    task_data = await _build_task_response(task, db)

    return {
        "status": "success",
        "data": task_data,
        "message": None,
    }


@router.get("/projects/{project_id}/tasks")
async def list_tasks(
    project_id: uuid.UUID,
    status_filter: TaskStatus | None = Query(default=None, alias="status"),
    priority_filter: TaskPriority | None = Query(default=None, alias="priority"),
    assignee_id: uuid.UUID | None = Query(default=None),
    sort_by: str = Query(default="position"),
    order: str = Query(default="asc"),
    page: int = Query(default=1, ge=1),
    size: int = Query(default=50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """프로젝트의 태스크 목록을 조회한다. 필터/정렬/페이지네이션을 지원한다."""
    await _get_project_or_404(project_id, db)
    await _check_membership(project_id, current_user.id, db)

    # 기본 조건
    conditions = [
        Task.project_id == project_id,
        Task.is_deleted == False,  # noqa: E712
    ]
    if status_filter is not None:
        conditions.append(Task.status == status_filter.value)
    if priority_filter is not None:
        conditions.append(Task.priority == priority_filter.value)
    if assignee_id is not None:
        conditions.append(Task.assignee_id == assignee_id)

    # 총 개수
    count_stmt = select(func.count()).select_from(
        select(Task.id).where(*conditions).subquery()
    )
    total = (await db.execute(count_stmt)).scalar() or 0

    # 정렬
    sort_column_map = {
        "position": Task.position,
        "created_at": Task.created_at,
        "priority": Task.priority,
    }
    sort_col = sort_column_map.get(sort_by, Task.position)
    order_clause = sort_col.desc() if order == "desc" else sort_col.asc()

    # 조회
    stmt = (
        select(Task)
        .where(*conditions)
        .order_by(order_clause)
        .offset((page - 1) * size)
        .limit(size)
    )
    result = await db.execute(stmt)
    tasks = result.scalars().all()

    items = []
    for t in tasks:
        items.append(await _build_task_response(t, db))

    return {
        "status": "success",
        "data": TaskListResponse(
            items=[TaskResponse(**i) for i in items],
            total=total,
            page=page,
            size=size,
        ).model_dump(),
        "message": None,
    }


@router.get("/projects/{project_id}/tasks/{task_id}")
async def get_task(
    project_id: uuid.UUID,
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """태스크 상세 정보를 조회한다."""
    await _get_project_or_404(project_id, db)
    await _check_membership(project_id, current_user.id, db)

    result = await db.execute(
        select(Task).where(
            Task.id == task_id,
            Task.project_id == project_id,
            Task.is_deleted == False,  # noqa: E712
        )
    )
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="태스크를 찾을 수 없습니다",
        )

    task_data = await _build_task_response(task, db)

    return {
        "status": "success",
        "data": task_data,
        "message": None,
    }


@router.patch("/projects/{project_id}/tasks/{task_id}")
async def update_task(
    project_id: uuid.UUID,
    task_id: uuid.UUID,
    body: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """태스크를 수정한다. 부분 수정(PATCH)을 지원한다."""
    await _get_project_or_404(project_id, db)
    await _check_membership(project_id, current_user.id, db)

    result = await db.execute(
        select(Task).where(
            Task.id == task_id,
            Task.project_id == project_id,
            Task.is_deleted == False,  # noqa: E712
        )
    )
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="태스크를 찾을 수 없습니다",
        )

    update_data = body.model_dump(exclude_unset=True)

    # 담당자 변경 시 프로젝트 멤버인지 확인
    if "assignee_id" in update_data and update_data["assignee_id"] is not None:
        mem_result = await db.execute(
            select(ProjectMember).where(
                ProjectMember.project_id == project_id,
                ProjectMember.user_id == update_data["assignee_id"],
            )
        )
        if mem_result.scalar_one_or_none() is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="담당자는 프로젝트 멤버여야 합니다",
            )

    # status, priority는 enum value로 변환
    if "status" in update_data and update_data["status"] is not None:
        update_data["status"] = update_data["status"].value
    if "priority" in update_data and update_data["priority"] is not None:
        update_data["priority"] = update_data["priority"].value

    for key, value in update_data.items():
        setattr(task, key, value)

    await db.flush()
    await db.refresh(task)

    task_data = await _build_task_response(task, db)

    return {
        "status": "success",
        "data": task_data,
        "message": None,
    }


@router.delete(
    "/projects/{project_id}/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_task(
    project_id: uuid.UUID,
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """태스크를 소프트 삭제한다."""
    await _get_project_or_404(project_id, db)
    await _check_membership(project_id, current_user.id, db)

    result = await db.execute(
        select(Task).where(
            Task.id == task_id,
            Task.project_id == project_id,
            Task.is_deleted == False,  # noqa: E712
        )
    )
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="태스크를 찾을 수 없습니다",
        )

    task.is_deleted = True
    await db.flush()
    return None
