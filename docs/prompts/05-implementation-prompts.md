# 5단계: 구현 프롬프트

> 설계 문서를 바탕으로 실제 코드를 생성하는 프롬프트입니다.

---

## 5-1. 프로젝트 초기 설정

**참조 문서:** `docs/04-implementation/development-plan.md`
**산출물:** `docker-compose.yml`, `.env.example`, `Dockerfile` 등

```
docs/04-implementation/development-plan.md 의 Phase 1을 구현해줘.

다음 파일을 생성해줘:
1. docker-compose.yml (frontend, backend, db 3개 서비스)
2. .env.example (DB 접속 정보, JWT 시크릿, 포트)
3. backend/Dockerfile (Python 3.12-slim, uvicorn)
4. frontend/Dockerfile (Node 20-alpine, next dev)
5. backend/requirements.txt
6. frontend/package.json

Docker 규칙:
- 서비스 간 통신은 Docker 내부 서비스명 사용 (localhost 금지)
- DB 호스트는 'db'로 지정
- 환경 변수는 .env에서 참조
```

---

## 5-2. 백엔드 인증

**참조 문서:** `docs/03-architecture/api-design.md`, `docs/03-architecture/database-schema.md`
**산출물:** `backend/app/` 내 인증 관련 파일

```
다음 문서를 참조하여 인증 시스템을 구현해줘:
- docs/03-architecture/api-design.md (Auth 섹션)
- docs/03-architecture/database-schema.md (users 테이블)

구현 항목:
1. DB 연결 설정 (backend/app/database.py)
2. User 모델 (backend/app/models/user.py)
3. 인증 유틸리티 (backend/app/utils/auth.py)
   - 비밀번호 해싱 (bcrypt)
   - JWT 토큰 생성/검증
   - get_current_user 의존성
4. Pydantic 스키마 (backend/app/schemas/user.py)
5. Auth API 라우터 (backend/app/api/auth.py)
   - POST /api/v1/auth/register
   - POST /api/v1/auth/login

응답 형식은 API 설계 문서의 공통 형식을 따라줘:
{"success": true, "data": {...}, "message": "..."}
```

---

## 5-3. 프로젝트 CRUD

**참조 문서:** `docs/03-architecture/api-design.md`, `docs/03-architecture/database-schema.md`
**산출물:** `backend/app/` 내 프로젝트 관련 파일

```
다음 문서를 참조하여 프로젝트 CRUD를 구현해줘:
- docs/03-architecture/api-design.md (Projects 섹션)
- docs/03-architecture/database-schema.md (projects, project_members 테이블)

구현 항목:
1. Project, ProjectMember 모델 (backend/app/models/project.py)
2. Pydantic 스키마 (backend/app/schemas/project.py)
3. Projects API 라우터 (backend/app/api/projects.py)
   - GET /api/v1/projects
   - POST /api/v1/projects
   - GET /api/v1/projects/{id}
   - POST /api/v1/projects/{id}/members

프로젝트 생성 시 생성자를 자동으로 owner 멤버로 추가해줘.
모든 엔드포인트는 JWT 인증이 필요해.
```

---

## 5-4. 태스크 CRUD

**참조 문서:** `docs/03-architecture/api-design.md`, `docs/03-architecture/database-schema.md`
**산출물:** `backend/app/` 내 태스크 관련 파일

```
다음 문서를 참조하여 태스크 CRUD를 구현해줘:
- docs/03-architecture/api-design.md (Tasks 섹션)
- docs/03-architecture/database-schema.md (tasks 테이블)

구현 항목:
1. Task 모델 (backend/app/models/task.py)
2. Pydantic 스키마 (backend/app/schemas/task.py)
3. Tasks API 라우터 (backend/app/api/tasks.py)
   - GET /api/v1/projects/{id}/tasks (필터: status, priority, assignee_id)
   - POST /api/v1/projects/{id}/tasks
   - PATCH /api/v1/tasks/{id} (칸반 상태 변경 포함)
   - DELETE /api/v1/tasks/{id}

PATCH는 칸반 드래그 앤 드롭에서 상태 변경에 사용되므로,
status만 보내도 동작하도록 모든 필드를 Optional로 처리해줘.
```

---

## 5-5. 프론트엔드

**참조 문서:** `docs/02-design/ui-design.md`, `docs/02-design/wireframe.md`, `docs/03-architecture/api-design.md`
**산출물:** `frontend/src/` 내 전체 파일

```
다음 문서를 참조하여 프론트엔드를 구현해줘:
- docs/02-design/ui-design.md (디자인 시스템, 컴포넌트 정의)
- docs/02-design/wireframe.md (화면 구조, 인터랙션)
- docs/03-architecture/api-design.md (API 스펙)

기술 스택: Next.js + TypeScript + Tailwind CSS
드래그 앤 드롭: @hello-pangea/dnd

구현 항목:
1. 공통 컴포넌트: Button, Input, Modal
2. API 클라이언트 (src/lib/api.ts)
3. 타입 정의 (src/types/index.ts)
4. 페이지:
   - 로그인/회원가입 (src/app/login/page.tsx)
   - 대시보드 (src/app/dashboard/page.tsx)
   - 칸반 보드 (src/app/projects/[id]/page.tsx)

UI 디자인 문서의 색상, 컴포넌트 스펙을 따라줘.
칸반 보드는 드래그 앤 드롭으로 상태를 변경하고,
변경 시 PATCH /tasks/:id API를 호출해줘.
```
