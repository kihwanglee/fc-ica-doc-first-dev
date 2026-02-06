# fc-ica-doc-first-dev

Fast Campus Inner Circle AI Master Course

## TaskFlow

소규모 팀(3~15명)을 위한 경량 태스크 관리 SaaS입니다. 프로젝트 단위로 태스크를 칸반 보드 형태로 관리할 수 있습니다.

> 이 프로젝트는 **Doc-First AI 개발 방법론**의 예제 프로젝트로, 문서를 먼저 작성한 뒤 AI를 활용하여 구현하는 워크플로우를 시연합니다.

## 주요 기능

- **사용자 인증** — 회원가입 / 로그인 (JWT 기반)
- **프로젝트 관리** — 프로젝트 생성, 수정, 삭제, 멤버 초대
- **태스크 관리** — 태스크 CRUD, 담당자 지정, 우선순위 설정
- **칸반 보드** — 드래그앤드롭으로 태스크 상태 변경 (TODO → In Progress → Done)
- **대시보드** — 전체 프로젝트 현황 요약

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python 3.12), SQLAlchemy 2.x |
| Database | PostgreSQL 16 |
| 인증 | JWT (HS256) |
| 인프라 | Docker, Docker Compose |

## 사전 요구사항

| 도구 | 버전 | 필수 여부 | 용도 |
|------|------|-----------|------|
| Docker & Docker Compose | 최신 | 필수 | 서비스 실행 |
| Node.js | 20 이상 | 권장 | IDE 자동완성, 타입 체크 |
| Python | 3.12 이상 | 권장 | IDE 자동완성, 타입 체크 |

> Docker만 있으면 서비스 실행은 가능하지만, Cursor 등 IDE에서 코드 편집 시 자동완성과 타입 체크를 위해 Node.js와 Python을 로컬에 설치하는 것을 권장합니다.

## 실행 방법

```bash
# 1. 환경 변수 설정
cp .env.example .env

# 2. Docker Compose로 전체 서비스 실행
docker compose up --build

# 3. 접속
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000/api/v1
# - API 문서 (Swagger): http://localhost:8000/docs
```

## 중지 방법

```bash
# 서비스 중지 (컨테이너 제거)
docker compose down

# 서비스 중지 + DB 데이터 삭제
docker compose down -v
```

## 환경 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `POSTGRES_USER` | PostgreSQL 사용자명 | `taskflow` |
| `POSTGRES_PASSWORD` | PostgreSQL 비밀번호 | `taskflow1234` |
| `POSTGRES_DB` | PostgreSQL 데이터베이스명 | `taskflow` |
| `DATABASE_URL` | SQLAlchemy DB 접속 URL | `postgresql+asyncpg://taskflow:taskflow1234@db:5432/taskflow` |
| `JWT_SECRET` | JWT 서명 비밀 키 | `your-super-secret-key-change-in-production` |
| `JWT_ALGORITHM` | JWT 알고리즘 | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 액세스 토큰 만료 시간(분) | `30` |
| `FRONTEND_URL` | 프론트엔드 URL (CORS 허용) | `http://localhost:3000` |
| `BACKEND_URL` | 백엔드 API URL | `http://localhost:8000/api/v1` |

## 프로젝트 문서 (Doc-First)

`docs/` 폴더에 개발 전 작성된 문서가 단계별로 정리되어 있습니다.

| 폴더 | 내용 | 주요 문서 |
|------|------|-----------|
| `01-requirements/` | 요구사항 정의 | [PRD](docs/01-requirements/PRD.md), [유저 스토리](docs/01-requirements/user-stories.md) |
| `02-design/` | UI/UX 설계 | [와이어프레임](docs/02-design/wireframe.md), [UI 디자인 가이드](docs/02-design/ui-design.md) |
| `03-architecture/` | 기술 아키텍처 | [API 설계](docs/03-architecture/api-design.md), [DB 스키마](docs/03-architecture/database-schema.md) |
| `04-implementation/` | 구현 가이드 | [개발 계획](docs/04-implementation/development-plan.md) |
| `05-testing/` | 테스트 가이드 | [통합 테스트 가이드](docs/05-testing/integration-test-guide.md) (curl, Python, Playwright) |
| `prompts/` | AI 프롬프트 | [각 단계별 프롬프트 모음](docs/prompts/README.md) (요구사항→설계→구현→테스트→배포) |
| `bugfix/` | 버그 수정 기록 | [버그 수정 로그](docs/bugfix/bugfix-log.md), [프롬프트 로그](docs/bugfix/bugfix-prompt-log.md) |
| `tutorial/` | 강의 자료 | [Doc-First AI 개발 가이드](docs/tutorial/doc-first-ai-dev.md), [GitHub 협업 가이드](docs/tutorial/github-collabo.md) |

## 테스트 실행

```bash
# 1. Docker 서비스 실행
docker compose up --build -d

# 2. curl 스모크 테스트 (빠른 확인)
bash tests/smoke-test.sh

# 3. Python API 테스트 (상세 검증)
pip install requests pytest
pytest tests/test_api.py -v

# 4. Playwright E2E 테스트 (전체 흐름)
pip install playwright pytest-playwright
playwright install chromium
pytest tests/test_e2e.py -v
```

> 테스트 코드의 전체 예시, 실행 방법, 트러블슈팅은 [통합 테스트 가이드](docs/05-testing/integration-test-guide.md)를 참조하세요.

## 튜토리얼 문서

### [Doc-First AI 개발 가이드](docs/tutorial/doc-first-ai-dev.md)

바이브 코딩의 한계를 분석하고, 문서를 먼저 작성한 뒤 AI로 코드를 생성하는 **Doc-First AI Development** 방법론을 다룹니다. PRD → 사용자 스토리 → 와이어프레임 → API/DB 설계 → 구현 → 테스트까지 7단계 프로세스와, 각 단계별 문서 템플릿·프롬프트 예시·체크리스트를 제공합니다. Cursor Project Rules(`.cursor/rules/*.mdc`) 설정법과 변경 관리 워크플로우도 포함되어 있습니다.

### [GitHub 협업 가이드](docs/tutorial/github-collabo.md)

GitHub + GitHub Desktop + Cursor를 활용한 팀 협업 실습 가이드입니다. 기획 문서 협업, 기능 개발 브랜치 공유, PR 기반 수정 요청, 충돌 해결, Issue 기반 작업 관리, Fork & PR(오픈소스 기여) 등 6가지 시나리오를 단계별로 설명합니다. 브랜치 네이밍, Conventional Commits, PR 템플릿 등 실무 컨벤션도 포함되어 있습니다.

## 디렉토리 구조

```
fc-ica-doc-first-dev/
├── docs/                  # 프로젝트 문서 (Doc-First)
│   ├── 01-requirements/   # 요구사항 (PRD, 유저 스토리)
│   ├── 02-design/         # UI/UX 설계 (와이어프레임)
│   ├── 03-architecture/   # 아키텍처 (API 설계, DB 스키마)
│   ├── 04-implementation/ # 구현 가이드
│   ├── 05-testing/        # 테스트 가이드 (통합 테스트)
│   ├── bugfix/            # 버그 수정 기록
│   ├── prompts/           # AI 프롬프트 모음 (단계별 분리)
│   │   ├── README.md      # 프롬프트 인덱스 및 사용 가이드
│   │   ├── 01-requirements-prompts.md   # 요구사항 정의
│   │   ├── 02-design-prompts.md         # UI/UX 설계
│   │   ├── 03-architecture-prompts.md   # 아키텍처 설계
│   │   ├── 04-planning-prompts.md       # 개발 계획
│   │   ├── 05-implementation-prompts.md # 코드 구현
│   │   ├── 06-testing-prompts.md        # 테스트 작성
│   │   ├── 07-deployment-prompts.md     # 배포
│   │   └── 08-maintenance-prompts.md    # 유지보수
│   └── tutorial/          # 강의 자료 (Doc-First AI 개발, GitHub 협업)
├── frontend/              # Next.js 프론트엔드
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── app/           # 페이지 (대시보드, 로그인, 프로젝트)
│       ├── components/    # 공통 UI 컴포넌트
│       ├── lib/           # API 클라이언트
│       └── types/         # TypeScript 타입 정의
├── backend/               # FastAPI 백엔드
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py        # FastAPI 앱 엔트리포인트
│       ├── config.py      # 설정 (환경 변수)
│       ├── database.py    # DB 연결 설정
│       ├── api/           # API 라우터 (인증, 프로젝트, 태스크)
│       ├── models/        # SQLAlchemy 모델
│       ├── schemas/       # Pydantic 스키마
│       └── utils/         # 유틸리티 (인증 등)
├── .claude/
│   └── rules/             # Claude Code 프로젝트 규칙
├── .cursor/
│   └── rules/             # Cursor 프로젝트 규칙
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```
