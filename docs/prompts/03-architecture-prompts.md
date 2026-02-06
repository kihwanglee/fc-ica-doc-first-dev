# 3단계: 아키텍처 설계 프롬프트

> 시스템의 기술적 구조를 설계하는 프롬프트입니다. API와 데이터베이스 스키마를 정의합니다.

---

## 3-1. API 설계

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

## 3-2. DB 설계

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
