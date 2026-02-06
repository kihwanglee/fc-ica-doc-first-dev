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

## 13단계: curl 기반 API 스모크 테스트 생성

**참조 문서:** `docs/03-architecture/api-design.md`
**산출물:** `tests/smoke-test.sh`

```
다음 문서를 참조하여 curl 기반 API 스모크 테스트 스크립트를 작성해줘:
- docs/03-architecture/api-design.md

회원가입 → 로그인 → 프로젝트 생성 → 태스크 생성 → 태스크 상태 변경의
전체 흐름을 테스트하는 bash 스크립트로 작성해줘.

각 단계에서:
- HTTP 상태 코드를 확인하고
- 실패 시 에러 메시지를 출력하고 중단하고
- 성공 시 다음 단계에 필요한 값(토큰, ID 등)을 추출해줘

jq로 JSON을 파싱하고, 타임스탬프 기반으로 고유한 이메일을 생성해서
반복 실행이 가능하도록 해줘.

파일 위치: tests/smoke-test.sh
```

---

## 14단계: Python API 통합 테스트 생성

**참조 문서:** `docs/03-architecture/api-design.md`, `docs/01-requirements/user-stories.md`
**산출물:** `tests/test_api.py`

```
다음 문서를 참조하여 Python 기반 API 통합 테스트를 작성해줘:
- docs/03-architecture/api-design.md
- docs/01-requirements/user-stories.md

pytest + requests를 사용하고, 다음을 포함해줘:
1. 인증 테스트 (회원가입, 로그인, 중복 이메일, 잘못된 비밀번호)
2. 프로젝트 CRUD 테스트 (생성, 목록 조회, 상세 조회, 수정)
3. 태스크 CRUD 테스트 (생성, 목록 조회, 상태 변경, 우선순위 변경, 삭제)
4. 전체 흐름 테스트 (회원가입 → 프로젝트 → 태스크 → 상태 변경)

각 테스트는 독립적으로 실행 가능해야 하고,
테스트 데이터는 타임스탬프로 고유하게 생성해줘.

파일 위치: tests/test_api.py
```

---

## 15단계: Playwright E2E 테스트 생성

**참조 문서:** `docs/02-design/wireframe.md`, `docs/02-design/ui-design.md`, `docs/01-requirements/user-stories.md`
**산출물:** `tests/test_e2e.py`

```
다음 문서를 참조하여 Playwright E2E 테스트를 작성해줘:
- docs/02-design/wireframe.md
- docs/02-design/ui-design.md
- docs/01-requirements/user-stories.md

Python + Playwright (sync API)로 작성하고, 다음 시나리오를 테스트해줘:
1. 회원가입 → 대시보드 이동
2. 로그인 → 대시보드 이동
3. 프로젝트 생성 → 목록에 표시 확인
4. 프로젝트 클릭 → 칸반 보드 표시
5. 칸반 보드에서 태스크 생성

셀렉터는 get_by_role, get_by_text, get_by_placeholder를 우선 사용해줘.
UI가 변경될 수 있으므로 정규식으로 유연하게 매칭해줘.

파일 위치: tests/test_e2e.py
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

---

## 배포 관련 프롬프트

> **참고:** 배포 워크플로우의 전체 흐름은 `docs/tutorial/deployment-guide.md`의 "8. AI Agent를 활용한 배포 워크플로우" 섹션을 참조하세요.

### Phase 1: 프로덕션 설정 파일 생성

**참조 문서:** `docs/tutorial/deployment-guide.md` (방법 B)
**산출물:** `docker-compose.prod.yml`, `frontend/Dockerfile.prod`, `nginx/default.conf`

#### 프롬프트 1-1: docker-compose.prod.yml 생성

```
docs/tutorial/deployment-guide.md의 "방법 B — AWS EC2 + Docker 올인원 배포" 섹션을 참조하여
프로덕션용 docker-compose.prod.yml 파일을 생성해줘.

요구사항:
1. 서비스: db, backend, frontend, nginx
2. db, backend, frontend는 포트를 외부에 노출하지 않음
3. nginx만 80번 포트를 외부에 노출
4. restart: unless-stopped 정책 적용
5. 환경 변수는 .env 파일에서 참조
6. backend는 프로덕션 모드로 실행 (--reload 제거)
7. frontend는 프로덕션 빌드 (Dockerfile.prod 사용)

파일 위치: docker-compose.prod.yml
```

#### 프롬프트 1-2: frontend/Dockerfile.prod 생성

```
프론트엔드 프로덕션용 Dockerfile을 생성해줘.

요구사항:
1. Multi-stage 빌드 (builder + runner)
2. Node 20-alpine 이미지 사용
3. builder 스테이지에서 npm run build 실행
4. runner 스테이지에서 npm start 실행 (프로덕션 서버)
5. NEXT_PUBLIC_API_URL 환경 변수를 빌드 시 주입
6. 최종 이미지 크기 최소화

파일 위치: frontend/Dockerfile.prod
```

#### 프롬프트 1-3: Nginx 설정 파일 생성

```
Nginx 리버스 프록시 설정 파일을 생성해줘.

요구사항:
1. 80번 포트 리스닝
2. /api/ 경로 → backend:8000으로 프록시
3. /docs, /openapi.json → backend:8000으로 프록시 (API 문서)
4. / 경로 → frontend:3000으로 프록시
5. WebSocket 지원 (proxy_http_version 1.1, Upgrade 헤더)
6. 프록시 헤더 설정 (Host, X-Real-IP, X-Forwarded-For, X-Forwarded-Proto)

파일 위치: nginx/default.conf
```

#### 프롬프트 1-4: 환경 변수 템플릿 생성

```
프로덕션 환경 변수 템플릿 파일을 생성해줘.

포함 항목:
1. PostgreSQL 설정 (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB)
2. Backend DB 접속 (DATABASE_URL with asyncpg)
3. JWT 설정 (JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES)
4. 서비스 URL (FRONTEND_URL, BACKEND_URL)

주의사항:
- 실제 값 대신 플레이스홀더 사용 (예: <EC2-PUBLIC-IP>)
- 보안 관련 값은 강력한 비밀번호로 변경하라는 주석 추가
- JWT_SECRET 생성 명령어 주석으로 추가 (openssl rand -hex 32)

파일 위치: .env.production.example
```

---

### Phase 3: 배포 스크립트 생성

**참조 문서:** `docs/tutorial/deployment-guide.md`
**산출물:** `scripts/setup-server.sh`, `scripts/deploy.sh`, `scripts/update.sh`

#### 프롬프트 3-1: 서버 초기 설정 스크립트

```
AWS EC2 Ubuntu 서버의 초기 설정을 자동화하는 bash 스크립트를 작성해줘.

실행 항목:
1. 시스템 패키지 업데이트 (apt update && apt upgrade)
2. Docker 설치 (공식 저장소 사용)
3. Docker Compose 플러그인 설치
4. 현재 사용자를 docker 그룹에 추가
5. Git 설치
6. 각 단계마다 진행 상황 출력
7. 에러 발생 시 스크립트 중단 (set -e)

파일 위치: scripts/setup-server.sh

스크립트는 최초 1회만 실행되며, EC2 인스턴스에 SSH 접속 후 실행됩니다.
```

#### 프롬프트 3-2: 초기 배포 스크립트

```
프로젝트를 처음 배포하는 스크립트를 작성해줘.

실행 항목:
1. 환경 변수 파일(.env) 존재 확인
2. docker-compose.prod.yml로 서비스 빌드 및 시작
3. 컨테이너 상태 확인
4. 서비스 헬스 체크 (curl로 localhost 확인)
5. 각 단계마다 성공/실패 메시지 출력
6. 에러 발생 시 스크립트 중단 (set -e)

파일 위치: scripts/deploy.sh

실행 예시: ./scripts/deploy.sh
```

#### 프롬프트 3-3: 코드 업데이트 스크립트

```
코드 변경 후 재배포하는 스크립트를 작성해줘.

실행 항목:
1. Git으로 최신 코드 pull (git pull origin main)
2. 기존 컨테이너 중지 및 제거
3. 새 이미지 빌드
4. 컨테이너 재시작
5. 미사용 Docker 이미지 정리 (선택적)
6. 각 단계마다 진행 상황 출력

파일 위치: scripts/update.sh

실행 예시: ./scripts/update.sh
```

---

### 배포 관련 유용한 프롬프트

#### 프로덕션 설정 검증

```
현재 프로덕션 설정 파일들을 검증해줘.

확인 항목:
1. docker-compose.prod.yml이 문법적으로 올바른가?
2. 외부에 노출되지 않아야 할 포트가 노출되어 있는가?
3. 환경 변수가 올바르게 참조되는가?
4. restart 정책이 설정되어 있는가?
5. 프로덕션 모드로 실행되는가? (개발 모드 플래그 제거)

로컬에서 다음 명령어로 검증:
docker compose -f docker-compose.prod.yml config
```

#### Nginx 설정 디버깅

```
Nginx 설정이 동작하지 않는다. 다음을 확인해줘:

문제 상황:
- 증상: [구체적인 증상 설명]
- 브라우저 개발자 도구 에러: [에러 메시지]

확인 항목:
1. upstream 서버 이름이 docker-compose의 서비스명과 일치하는가?
2. location 블록의 순서가 올바른가? (구체적 경로가 먼저)
3. 프록시 헤더가 올바르게 설정되어 있는가?
4. WebSocket 지원이 필요한가?

Nginx 로그 확인 명령어:
docker compose -f docker-compose.prod.yml logs nginx
```

#### 환경 변수 트러블슈팅

```
서비스가 실행되지 않는다. 환경 변수 설정을 점검해줘.

확인 항목:
1. .env 파일이 프로젝트 루트에 존재하는가?
2. DATABASE_URL의 호스트명이 'db'인가? (Docker 내부 통신)
3. FRONTEND_URL과 BACKEND_URL이 EC2 퍼블릭 IP를 사용하는가?
4. JWT_SECRET이 설정되어 있는가?
5. NEXT_PUBLIC_ 접두사가 있는 환경 변수는 빌드 시 주입되는가?

컨테이너 환경 변수 확인 명령어:
docker compose -f docker-compose.prod.yml exec backend env
docker compose -f docker-compose.prod.yml exec frontend env
```

#### HTTPS 설정 추가 (Let's Encrypt)

```
현재 HTTP로 동작하는 서비스에 HTTPS를 추가해줘.

요구사항:
1. Let's Encrypt Certbot 사용
2. Nginx 설정에 SSL 인증서 경로 추가
3. HTTP → HTTPS 자동 리다이렉트
4. docker-compose.prod.yml에 certbot 서비스 추가
5. 인증서 자동 갱신 설정

참고:
- 도메인: [도메인 입력]
- 이메일: [이메일 입력]

설정 파일 수정 및 certbot 실행 명령어를 알려줘.
```

---

## 배포 후 운영 프롬프트

#### 모니터링 스크립트 생성

```
서비스 상태를 모니터링하는 스크립트를 작성해줘.

확인 항목:
1. 모든 컨테이너가 실행 중인가?
2. 디스크 사용량이 80% 미만인가?
3. 메모리 사용량이 80% 미만인가?
4. 프론트엔드/백엔드가 응답하는가? (curl)
5. DB 연결이 정상인가?

이상 발견 시 경고 메시지 출력.

파일 위치: scripts/health-check.sh
```

#### 백업 스크립트 생성

```
데이터베이스를 백업하는 스크립트를 작성해줘.

기능:
1. PostgreSQL 데이터 dump (pg_dump)
2. 타임스탬프가 포함된 파일명으로 저장
3. 7일 이상 된 백업 파일 자동 삭제
4. 백업 성공/실패 로그 기록

파일 위치: scripts/backup-db.sh

cron으로 매일 자동 실행할 수 있도록 작성해줘.
```

#### 로그 분석 프롬프트

```
Docker 로그를 분석하여 문제를 파악해줘.

로그 수집 명령어:
docker compose -f docker-compose.prod.yml logs --tail 100

다음을 확인해줘:
1. 에러 메시지가 있는가?
2. 컨테이너가 재시작되고 있는가?
3. DB 연결 실패 로그가 있는가?
4. 메모리 부족(OOM) 로그가 있는가?
5. API 호출 실패 패턴이 있는가?

문제의 원인과 해결 방법을 제시해줘.
```
