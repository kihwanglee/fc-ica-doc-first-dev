# Doc-First AI Development: 단계별 프롬프트 모음

> 이 문서는 TaskFlow 프로젝트를 Doc-First 방법론으로 개발할 때 각 단계에서 사용한 프롬프트를 순서대로 정리한 것이다.
> 각 프롬프트는 Cursor, Claude Code 등 AI 코딩 도구에서 그대로 사용할 수 있다.

---

## 1단계: PRD 생성

**참조 문서:** 없음 (첫 단계)
**산출물:** `docs/01-requirements/PRD.md`

```
다음 프로젝트에 대한 PRD(Product Requirements Document)를 작성해줘.

프로젝트 개요:
팀 협업을 위한 칸반 보드 기반 태스크 관리 SaaS (이름: TaskFlow)

대상 사용자:
- 주 사용자: 프로젝트 매니저, 팀 리더
- 부 사용자: 개발자, 디자이너 등 팀원

핵심 문제:
여러 프로젝트를 동시에 진행하는 팀에서 태스크 추적과 우선순위 관리가 어렵다.

주요 기능:
1. 사용자 인증 (이메일/비밀번호)
2. 프로젝트 생성 및 멤버 초대
3. 태스크 CRUD (제목, 설명, 담당자, 마감일, 우선순위, 상태)
4. 칸반 보드 뷰 (드래그 앤 드롭으로 상태 변경)

다음 구조를 따라 작성해줘:

# PRD: TaskFlow
## 1. 프로젝트 개요 (배경, 목표, 성공 지표)
## 2. 사용자 분석 (타겟 사용자, 니즈, 시나리오)
## 3. 기능 요구사항 (MVP 필수 기능 / 선택 기능 / 향후 계획)
## 4. 비기능 요구사항 (성능, 보안, 접근성)
## 5. 제약사항 (기술적, 비즈니스, 일정)
## 6. 우선순위 (P0/P1/P2 분류)

구현 방법은 쓰지 마. "무엇을" 만들지에만 집중해.

파일 위치: docs/01-requirements/PRD.md
```

---

## 2단계: 사용자 스토리 생성

**참조 문서:** `docs/01-requirements/PRD.md`
**산출물:** `docs/01-requirements/user-stories.md`

```
docs/01-requirements/PRD.md 를 참조하여 사용자 스토리를 작성해줘.

다음 형식을 따라줘:

### US-001: [스토리 제목]
**As a** [사용자 유형]
**I want to** [수행하려는 작업]
**So that** [달성하려는 목표]

**인수 조건:**
- [ ] [조건 1]
- [ ] [조건 2]

**우선순위:** P0/P1/P2

다음 기능 영역을 모두 커버해줘:
- 인증: 회원가입, 로그인, 로그아웃
- 프로젝트: 생성, 목록 조회, 멤버 초대
- 태스크: 생성, 수정, 삭제, 상태 변경, 필터링
- 보드 뷰: 칸반 드래그 앤 드롭

PRD의 기능 번호(F1, F2, ...)와 매핑해줘.

파일 위치: docs/01-requirements/user-stories.md
```

---

## 3단계: 텍스트 와이어프레임 생성

**참조 문서:** `docs/01-requirements/PRD.md`, `docs/01-requirements/user-stories.md`
**산출물:** `docs/02-design/wireframe.md`

```
다음 문서를 참조하여 텍스트 기반 와이어프레임을 작성해줘:
- docs/01-requirements/PRD.md
- docs/01-requirements/user-stories.md

ASCII 아트로 레이아웃을 표현하고, 시각적 디자인(색상, 폰트 등)은 포함하지 마.

다음 화면을 포함해줘:
1. 로그인 / 회원가입
2. 대시보드 (프로젝트 목록)
3. 프로젝트 보드 (칸반 뷰)
4. 태스크 상세 (사이드 패널)

각 화면마다 다음을 명시해줘:
- 레이아웃 구조 (ASCII 박스)
- 컴포넌트 상세 설명
- 사용자 인터랙션 (액션 → 결과)
- 화면 전환 경로

파일 위치: docs/02-design/wireframe.md
```

---

## 4단계: UI 디자인 명세 생성

**참조 문서:** `docs/02-design/wireframe.md`
**산출물:** `docs/02-design/ui-design.md`

```
docs/02-design/wireframe.md 를 기반으로 UI 디자인 명세를 작성해줘.
기술 스택은 Next.js + Tailwind CSS 이다.

다음 내용을 포함해줘:
1. 디자인 원칙 (예: Minimal, Accessible)
2. 디자인 시스템
   - 색상 팔레트 (Tailwind 클래스와 함께)
   - 타이포그래피
   - 간격 체계
3. 공통 컴포넌트 정의
   - Button (variant, size, 상태)
   - Input (label, error, helper text)
   - Card
   - Modal
   - TaskCard (우선순위 뱃지, 담당자 등)
4. 화면별 컴포넌트 구성
5. 반응형 가이드 (Desktop / Tablet / Mobile)

코드는 작성하지 마. 디자인 문서로만 작성해줘.

파일 위치: docs/02-design/ui-design.md
```

---

## 5단계: API 설계

**참조 문서:** `docs/01-requirements/PRD.md`, `docs/02-design/wireframe.md`
**산출물:** `docs/03-architecture/api-design.md`

```
다음 문서를 참조하여 RESTful API 설계 문서를 작성해줘:
- docs/01-requirements/PRD.md
- docs/02-design/wireframe.md

기술 스택: FastAPI (Python), JWT 인증

다음 형식을 따라줘:

## API 개요
- Base URL: /api/v1
- 인증: JWT Bearer Token
- 공통 응답 형식 (성공/에러 JSON 구조)
- HTTP 상태 코드 정의

## 엔드포인트
각 엔드포인트마다:
- HTTP 메서드 + 경로
- 설명
- 요청 스키마 (Headers, Parameters, Body)
- 응답 스키마 (성공 + 에러 케이스)
- JSON 예시

다음 리소스를 포함해줘:
- Auth: 회원가입, 로그인
- Projects: CRUD + 멤버 관리
- Tasks: CRUD (프로젝트 범위 내)

구현 코드는 작성하지 마. API 계약(Contract)만 정의해줘.

파일 위치: docs/03-architecture/api-design.md
```

---

## 6단계: DB 설계

**참조 문서:** `docs/01-requirements/PRD.md`, `docs/03-architecture/api-design.md`
**산출물:** `docs/03-architecture/database-schema.md`

```
다음 문서를 참조하여 PostgreSQL 데이터베이스 스키마를 설계해줘:
- docs/01-requirements/PRD.md
- docs/03-architecture/api-design.md

다음 내용을 포함해줘:
1. ERD (Mermaid erDiagram 형식)
2. 테이블 정의
   - CREATE TABLE SQL (제약조건, 인덱스 포함)
   - 컬럼별 설명
3. 관계 정의 (1:N, N:M, FK 삭제 동작)
4. 인덱스 전략 (주요 쿼리 패턴별)

테이블: users, projects, project_members, tasks
(MVP 범위에 맞게 간결하게)

파일 위치: docs/03-architecture/database-schema.md
```

---

## 7단계: 개발 계획 수립

**참조 문서:** 모든 설계 문서
**산출물:** `docs/04-implementation/development-plan.md`

```
docs/ 내 모든 문서를 참조하여 개발 계획을 수립해줘.

기술 스택:
- 프론트엔드: Next.js + TypeScript + Tailwind CSS
- 백엔드: FastAPI + SQLAlchemy 2.x
- DB: PostgreSQL
- 로컬 환경: Docker / Docker Compose

다음 내용을 포함해줘:
1. Phase별 구현 항목
   - Phase 1: 프로젝트 초기 설정 (Docker, DB)
   - Phase 2: 인증 시스템
   - Phase 3: 프로젝트 CRUD
   - Phase 4: 태스크 CRUD + 칸반
   - Phase 5: UI 구현 및 마무리
2. 각 Phase별 세부 작업 목록
3. Phase 간 의존성
4. 마일스톤과 완료 기준

기초 작업(DB, 인증)이 먼저 오고, 핵심 기능, UI 순으로 배치해줘.

파일 위치: docs/04-implementation/development-plan.md
```

---

## 8단계: 코드 생성 — 프로젝트 초기 설정

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

## 9단계: 코드 생성 — 백엔드 인증

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

## 10단계: 코드 생성 — 프로젝트 CRUD

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

## 11단계: 코드 생성 — 태스크 CRUD

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

## 12단계: 코드 생성 — 프론트엔드

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

---

## 부록: 변경 요청 프롬프트 템플릿

기능을 추가하거나 변경할 때 사용하는 범용 프롬프트:

```
[기능/변경 사항 설명]

다음 순서로 작업해줘:
1. docs/01-requirements/PRD.md 에 기능 추가
2. docs/01-requirements/user-stories.md 에 스토리 추가
3. 영향받는 설계 문서 업데이트 (API, DB 등)
4. 코드 구현
5. docs/04-implementation/changelog.md 에 변경 이력 기록

각 단계마다 변경 사항을 보여주고, 승인 받은 후 다음 단계로 진행해줘.
```

---

## 부록: 문서-코드 일치성 검증 프롬프트

```
현재 구현된 코드가 다음 문서들과 일치하는지 검증해줘:
- docs/03-architecture/api-design.md
- docs/03-architecture/database-schema.md

다음 항목을 확인해줘:
1. API 엔드포인트가 문서와 일치하는가?
2. 요청/응답 스키마가 문서와 일치하는가?
3. DB 모델이 스키마 문서와 일치하는가?
4. 에러 코드가 문서에 정의된 대로 사용되는가?

불일치 사항이 있으면 목록으로 정리해줘.
```
