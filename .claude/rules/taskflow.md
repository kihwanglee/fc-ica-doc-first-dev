# TaskFlow 프로젝트 규칙

## 프로젝트 개요
- **프로젝트명:** TaskFlow — 태스크 관리 SaaS
- **기술 스택:** Next.js (Frontend) + FastAPI (Backend) + PostgreSQL (DB) + Docker (로컬 환경)
- **방법론:** Doc-First (문서 우선) 개발

## Doc-First 원칙
1. **코드 작성 전 반드시 관련 문서를 먼저 확인한다.**
2. **문서에 정의된 API 스펙, DB 스키마, 요구사항을 기준으로 구현한다.**
3. **문서와 코드가 불일치할 경우, 문서를 우선으로 한다.**
4. **새로운 기능 추가 시 문서를 먼저 업데이트한 후 구현한다.**

## 문서 참조 경로
- 요구사항: `docs/01-requirements/`
- 설계 문서: `docs/02-design/`
- 아키텍처: `docs/03-architecture/`
  - API 설계: `docs/03-architecture/api-design.md`
  - DB 스키마: `docs/03-architecture/database-schema.md`
- 구현 가이드: `docs/04-implementation/`
- 테스트 가이드: `docs/05-testing/`

## 코딩 컨벤션

### 공통
- 모든 주석과 문서는 **한국어**로 작성한다.
- 커밋 메시지는 한국어로 작성한다. (예: `feat: 로그인 API 구현`)
- 변수명, 함수명은 영어를 사용하되, 주석은 한국어로 작성한다.

### Backend (FastAPI + Python)
- Python 3.12 사용
- 타입 힌트 필수 (모든 함수 파라미터와 반환값)
- SQLAlchemy 2.x async 패턴 사용
- Pydantic v2 모델 사용
- API 응답 형식은 `docs/03-architecture/api-design.md`의 공통 응답 형식을 따른다.
- 비동기(async/await) 패턴 사용

### Frontend (Next.js + TypeScript)
- Next.js App Router 사용
- TypeScript strict 모드 활성화
- Tailwind CSS로 스타일링
- 컴포넌트는 함수형 컴포넌트로 작성
- 서버 컴포넌트 우선, 필요시 클라이언트 컴포넌트 사용

### Docker
- 개발 환경은 `docker-compose.yml`로 관리한다.
- 환경 변수는 `.env` 파일로 관리하며, `.env.example`을 참조한다.
- DB 데이터는 Docker Volume으로 영속화한다.
- 백엔드는 `db` 서비스를 호스트명으로 사용한다 (localhost가 아님).

## API 응답 형식
```json
{
  "status": "success" | "error",
  "data": { ... } | null,
  "message": "..." | null
}
```

## DB 스키마 참조
- 테이블: users, projects, project_members, tasks
- 소프트 삭제: projects.is_deleted, tasks.is_deleted
- UUID 기본키 사용
- 상세 스키마는 `docs/03-architecture/database-schema.md` 참조
