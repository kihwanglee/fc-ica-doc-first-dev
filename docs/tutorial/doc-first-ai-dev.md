# Doc-First AI Development: 문서 주도 AI 개발 완전 가이드

> **Doc-First AI Development**란, AI 코드 생성 도구(Cursor 등)를 사용하되 즉흥적인 프롬프트 대신 **체계적인 문서 파이프라인**을 먼저 구축하고, 그 문서를 기반으로 코드를 생성하는 개발 방법론이다.

---

## 1. 바이브 코딩의 한계

### 1.1 바이브 코딩이란

바이브 코딩(Vibe Coding)은 AI에게 자연어로 즉흥적인 지시를 내려 코드를 생성하는 방식이다.

```
"로그인 페이지 만들어줘"
"여기에 대시보드 추가해줘"
"API 연결해줘"
```

직관적이고 빠르게 시작할 수 있지만, 프로젝트가 커질수록 치명적인 문제가 드러난다.

### 1.2 바이브 코딩이 실패하는 지점

| 문제 | 증상 | 근본 원인 |
|------|------|-----------|
| **일관성 붕괴** | 파일마다 코드 스타일, 구조, 네이밍이 제각각 | AI가 매번 새로운 컨텍스트에서 추론 |
| **요구사항 누락** | 기능이 빠지거나, 요청하지 않은 기능이 추가됨 | 명시적 기준 문서가 없음 |
| **수정의 연쇄 폭발** | 하나를 고치면 세 곳이 깨짐 | 전체 설계 없이 부분만 생성 |
| **재현 불가능** | 같은 결과를 다시 만들 수 없음 | 프롬프트가 휘발성이고 맥락 의존적 |
| **협업 불가능** | 다른 사람이 코드를 이해할 수 없음 | 의사결정 근거가 남지 않음 |
| **유지보수 불가능** | 한 달 후 자기 자신도 코드를 이해할 수 없음 | 설계 의도가 어디에도 기록되지 않음 |

### 1.3 핵심 통찰

> **AI는 생각을 코드로 번역하는 엔진이지, 생각을 대신하는 존재가 아니다.**

바이브 코딩의 실패는 AI의 능력 부족이 아니라 **입력의 부실** 때문이다. AI에게 충분한 맥락과 명확한 기준을 제공하지 않으면, 아무리 뛰어난 모델도 일관된 결과를 만들 수 없다.

---

## 2. Doc-First AI Development가 해결하는 것

### 2.1 핵심 원칙

```
코드는 결과물이지 출발점이 아니다.
문서가 Single Source of Truth이다.
모든 코드는 문서로부터 파생된다.
```

### 2.2 바이브 코딩 vs. Doc-First 비교

| 관점 | 바이브 코딩 | Doc-First AI Development |
|------|-------------|--------------------------|
| 출발점 | "이런 거 만들어줘" | PRD, 설계 문서 |
| AI의 역할 | 창작자 (알아서 만들어) | 번역기 (문서를 코드로 변환) |
| 일관성 | 보장 불가 | 문서가 기준이므로 일관됨 |
| 변경 관리 | 코드를 직접 수정 | 문서를 먼저 수정 → 코드 반영 |
| 재현성 | 불가 | 문서가 있으므로 언제든 재생성 가능 |
| 협업 | 프롬프트 히스토리 공유? | 문서를 공유 (기획자, 디자이너, 개발자 모두) |
| 리뷰 | 코드만 리뷰 | 설계 리뷰 + 코드 리뷰 |
| 교육 | 설명 불가능 | 과정 전체가 교육 자료가 됨 |

### 2.3 이 방법이 특히 효과적인 경우

- 강의, 교육, 워크숍 프로젝트
- 기획자, 디자이너, 개발자 협업이 필요한 프로젝트
- AI 활용 과정을 설명하거나 보고해야 하는 경우
- 나중에 유지보수, 인수인계가 예정된 프로젝트
- MVP를 빠르게 만들되, 이후 확장이 필요한 프로젝트

---

## 3. 전체 프로세스 흐름

### 3.1 Big Picture

```
아이디어
  |
  v
[Phase 1] 요구사항 정의
  ├── PRD (Product Requirements Document)
  └── 사용자 스토리 (User Stories)
  |
  v
[Phase 2] UX/UI 설계
  ├── 텍스트 와이어프레임 (Text Wireframe)
  └── UI 디자인 명세 (UI Design Spec)
  |
  v
[Phase 3] 기술 설계
  ├── API 설계 (API Design)
  ├── DB 설계 (Database Schema)
  └── 시스템 아키텍처 (System Architecture)
  |
  v
[Phase 4] 구현 계획
  └── 개발 계획서 (Development Plan)
  |
  v
[Phase 5] 코드 생성
  └── 기능별 반복 구현 (문서 참조 → 코드 생성 → 검증)
  |
  v
[Phase 6] 유지보수
  └── 변경 시 문서 먼저 수정 → 코드 반영 → 변경 이력 기록
```

### 3.2 핵심 규칙: 컨텍스트 체인

각 단계의 산출물은 **다음 단계의 입력**이 된다. 이 체인이 끊기면 바이브 코딩으로 퇴화한다.

```
PRD ──────────────────┐
  │                    │
  v                    │
사용자 스토리           │
  │                    │
  v                    │
텍스트 와이어프레임 ←──┘
  │
  v
UI 디자인 명세
  │
  v
API 설계 ←── PRD + 와이어프레임
  │
  v
DB 설계 ←── PRD + API 설계
  │
  v
개발 계획 ←── 모든 문서 종합
  │
  v
코드 생성 ←── 해당 기능의 설계 문서
```

---

## 4. 프로젝트 디렉토리 구조

코드를 작성하기 전에, 다음과 같은 문서 구조를 먼저 만든다.

```
project-root/
├── docs/
│   ├── 01-requirements/
│   │   ├── PRD.md                    # 제품 요구사항
│   │   └── user-stories.md           # 사용자 스토리
│   ├── 02-design/
│   │   ├── wireframe.md              # 텍스트 와이어프레임
│   │   ├── ui-design.md              # UI 디자인 명세
│   │   └── design-system.md          # 디자인 시스템 (선택)
│   ├── 03-architecture/
│   │   ├── api-design.md             # API 설계
│   │   ├── database-schema.md        # DB 스키마
│   │   └── system-architecture.md    # 시스템 아키텍처 (선택)
│   ├── 04-implementation/
│   │   ├── development-plan.md       # 개발 계획
│   │   └── changelog.md              # 변경 이력
│   └── prompts/                      # 재사용 프롬프트 템플릿
│       ├── prd.prompt.md
│       ├── wireframe.prompt.md
│       ├── api.prompt.md
│       └── new-feature.prompt.md
├── src/ (또는 backend/, frontend/)
├── .cursorrules                       # Cursor AI 행동 규칙
└── README.md
```

---

## 5. Cursor Project Rules 설정

`.cursorrules` 파일은 Cursor AI의 행동을 제약하는 프로젝트 규칙이다. Doc-First 방법론의 **자동 안전장치** 역할을 한다.

### 5.1 필수 규칙

```
## 문서 우선 원칙
- 코드를 생성하기 전에 반드시 docs/ 내 관련 문서를 먼저 읽는다
- docs/03-architecture/api-design.md가 존재하지 않으면 API 코드를 생성하지 않는다
- docs/03-architecture/database-schema.md가 존재하지 않으면 DB 모델을 생성하지 않는다
- 문서가 변경되면 코드도 문서에 맞게 수정한다
- docs/*.md 파일을 유일한 정보 기준(Single Source of Truth)으로 취급한다
- 요구사항이 불명확하면 코드 작성 전에 반드시 질문한다

## 컨텍스트 참조
코드 생성 시 반드시 다음 문서를 참조한다:
- docs/01-requirements/PRD.md: 기능 요구사항 및 비즈니스 로직
- docs/02-design/ui-design.md: UI/UX 설계 사항
- docs/03-architecture/api-design.md: API 엔드포인트 및 스펙
- docs/03-architecture/database-schema.md: 데이터 모델 및 스키마

## 금지 사항
- 설계 문서 없이 복잡한 기능을 구현하지 않는다
- PRD에 명시되지 않은 기능을 임의로 추가하지 않는다
- 설계 문서와 다른 구조로 코드를 작성하지 않는다
- 이전 답변과 모순되는 내용을 생성하지 않는다

## 질문 권장
다음 상황에서는 코드를 생성하기 전에 질문한다:
- PRD나 설계 문서의 내용이 모호한 경우
- 구현 방법이 여러 가지 가능한 경우
- 기존 문서와 충돌하는 요구사항이 있는 경우
- 보안이나 성능에 중대한 영향을 미치는 결정이 필요한 경우
```

### 5.2 기술 스택 고정 규칙 (예시)

```
## 기술 스택
프론트엔드:
- Next.js (React 기반)
- TypeScript
- Tailwind CSS

백엔드:
- FastAPI (Python 3.12)
- SQLAlchemy 2.x
- PostgreSQL

로컬 개발 환경:
- Docker / Docker Compose로 프론트엔드, 백엔드, DB를 모두 컨테이너로 구동
- 로컬에서 docker compose up 한 번으로 전체 스택 실행 가능하도록 구성

공통:
- 코드는 영어로 작성, 문서는 한국어 허용
- RESTful 규칙을 따른다

## Docker 규칙
- 프로젝트 루트에 docker-compose.yml을 유지한다
- 프론트엔드, 백엔드, DB는 각각 별도 컨테이너(서비스)로 구성한다
- 서비스 간 통신은 Docker 내부 네트워크의 서비스명을 사용한다 (localhost 금지)
  - 예: 백엔드에서 DB 연결 시 호스트를 db로 지정 (localhost:5432가 아님)
- DB 연결 정보, 포트 등 환경 변수는 .env 파일로 관리하고 docker-compose.yml에서 참조한다
- .env 파일은 .gitignore에 포함하고, .env.example 파일을 제공한다
- Dockerfile은 frontend/, backend/ 각 디렉토리에 배치한다
- 새로운 환경 변수나 서비스를 추가할 때는 docker-compose.yml과 .env.example을 함께 업데이트한다
```

### 5.3 코드 생성 규칙 (예시)

```
## 코딩 컨벤션
- 함수명: camelCase
- 컴포넌트명: PascalCase
- 상수명: UPPER_SNAKE_CASE
- 함수형 컴포넌트와 Hooks만 사용한다 (클래스 컴포넌트 금지)
- any 타입 사용을 금지한다
- 주석은 "왜(Why)"를 설명한다 (코드 자체가 "무엇(What)"을 설명)

## 응답 형식
코드를 제공할 때:
1. 관련 설계 문서 섹션을 간단히 인용한다
2. 구현 내용을 요약한다
3. 전체 코드를 제공한다
4. 다음 단계를 제안한다

## 변경 관리
코드를 수정할 때:
1. 변경 이유를 docs/04-implementation/changelog.md에 기록한다
2. 관련 설계 문서의 업데이트 필요 여부를 확인한다
3. 영향받는 다른 컴포넌트나 모듈을 확인한다
```

### 5.4 이 규칙이 중요한 이유

`.cursorrules`가 없으면, 개발자가 매번 프롬프트에 "이 문서를 참조해서..."라고 쓰는 것을 잊을 때마다 바이브 코딩으로 돌아간다. 규칙 파일은 **잊어도 작동하는 안전장치**다.

---

## 6. 단계별 문서 생성 상세 가이드

---

### 6.1 [Phase 1-1] PRD (Product Requirements Document)

> **목적**: 무엇을 만들 것인가를 정의한다. 구현 세부사항은 쓰지 않는다.

#### 산출물 위치

`docs/01-requirements/PRD.md`

#### 템플릿

```markdown
# PRD: [프로젝트명]

## 1. 프로젝트 개요
### 1.1 배경
[이 프로젝트가 필요한 이유]

### 1.2 목표
[달성하려는 구체적 목표 - 측정 가능하게]

### 1.3 성공 지표
[DAU, 전환율, 응답 시간 등 정량적 지표]

## 2. 사용자 분석
### 2.1 타겟 사용자
[주 사용자 / 부 사용자 페르소나]

### 2.2 사용자 니즈
[해결하려는 핵심 문제]

### 2.3 사용 시나리오
[실제 사용 흐름 서술]

## 3. 기능 요구사항
### 3.1 필수 기능 (MVP)
[번호를 매기고 각 기능을 구체적으로 정의]

### 3.2 선택 기능
[MVP 이후 추가할 기능]

### 3.3 향후 계획 기능
[장기적으로 고려하는 기능]

## 4. 비기능 요구사항
### 4.1 성능
[응답 시간, 동시 접속자 등]

### 4.2 보안
[인증 방식, 데이터 보호 등]

### 4.3 접근성
[WCAG 수준 등]

## 5. 제약사항
### 5.1 기술적 제약
### 5.2 비즈니스 제약
### 5.3 일정 제약

## 6. 우선순위
[P0 필수 / P1 중요 / P2 선택 분류]
```

#### Cursor 프롬프트 예시

```
You are a product manager.
Create a concise but clear PRD for the following idea:

[아이디어를 2~3문장으로 설명]

Target users: [타겟 사용자]
Key features: [핵심 기능 나열]

Use the template in docs/01-requirements/PRD.md.
Avoid implementation details - focus on WHAT, not HOW.
```

#### 체크포인트

- [ ] 구현 방법이 아닌 "무엇을"에 집중했는가?
- [ ] 각 기능에 번호와 우선순위가 매겨져 있는가?
- [ ] 성공 지표가 측정 가능한가?
- [ ] Scope 밖(Non-Goals)이 명시되어 있는가?

---

### 6.2 [Phase 1-2] 사용자 스토리 (User Stories)

> **목적**: PRD의 기능을 사용자 관점의 시나리오로 분해한다. 이후 와이어프레임과 API 설계의 직접적 입력이 된다.

#### 산출물 위치

`docs/01-requirements/user-stories.md`

#### 템플릿

```markdown
# 사용자 스토리

## [기능 카테고리]

### US-001: [스토리 제목]
**As a** [사용자 유형]
**I want to** [수행하려는 작업]
**So that** [달성하려는 목표]

**인수 조건:**
- [ ] [조건 1: 구체적이고 검증 가능한 조건]
- [ ] [조건 2]

**우선순위:** P0
```

#### Cursor 프롬프트 예시

```
docs/01-requirements/PRD.md 를 참조하여
사용자 스토리를 작성해줘.

각 스토리는 다음을 포함:
- As a / I want to / So that 형식
- 검증 가능한 인수 조건 (체크리스트)
- 우선순위 (P0/P1/P2)

PRD의 기능 번호와 매핑해줘.
```

#### 체크포인트

- [ ] PRD의 모든 MVP 기능이 최소 하나의 스토리로 분해되었는가?
- [ ] 인수 조건이 "예/아니오"로 검증 가능한가?
- [ ] 우선순위가 PRD와 일치하는가?

---

### 6.3 [Phase 2-1] 텍스트 와이어프레임 (Text Wireframe)

> **목적**: 화면의 시각적 디자인이 아닌 **사용자 흐름과 화면 구성**을 정의한다. 디자이너, 개발자, AI 모두가 이해할 수 있는 공통 언어다.

#### 산출물 위치

`docs/02-design/wireframe.md`

#### 템플릿

```markdown
# 텍스트 와이어프레임

## Screen: [화면명]

### 레이아웃
+------------------------------------------+
|  [영역 설명]                              |
+------------------------------------------+
|  Sidebar        |  Main Content           |
|                 |                         |
|  - Nav Item 1   |  [컨텐츠 영역 설명]     |
|  - Nav Item 2   |                         |
+------------------------------------------+

### 컴포넌트 상세
- [컴포넌트명]: [설명 및 동작]

### 인터랙션
- [사용자 액션] → [시스템 반응]

### 화면 전환
- [조건/액션] → [이동할 화면]
```

#### Cursor 프롬프트 예시

```
Based on:
- docs/01-requirements/PRD.md
- docs/01-requirements/user-stories.md

Create a text-based wireframe focusing on user flow.
No visual design, no colors, no fonts.
Use ASCII box drawing for layout.

Include these screens:
1. [화면 목록]

For each screen, specify:
- Layout structure
- Component list with descriptions
- User interactions and their results
- Screen transitions
```

#### 체크포인트

- [ ] 사용자 스토리의 모든 흐름이 화면으로 표현되었는가?
- [ ] 각 화면 간 전환 경로가 명확한가?
- [ ] 시각적 디자인 요소(색상, 폰트 등)가 포함되지 않았는가?

---

### 6.4 [Phase 2-2] UI 디자인 명세 (UI Design Spec)

> **목적**: 와이어프레임을 실제 구현 가능한 UI 명세로 변환한다. 디자인 시스템과 컴포넌트 규칙을 정의한다.

#### 산출물 위치

`docs/02-design/ui-design.md`

#### 템플릿

```markdown
# UI 디자인 명세

## 1. 디자인 원칙
- [예: Minimal, Accessible, Desktop-first]

## 2. 디자인 시스템

### 2.1 색상 팔레트
- Primary: [색상 코드]
- Secondary: [색상 코드]
- Background: [색상 코드]
- Text: [색상 코드]
- Error / Warning / Success: [색상 코드]

### 2.2 타이포그래피
- Heading 1: [폰트, 크기, 굵기]
- Body: [폰트, 크기, 굵기]

### 2.3 간격 체계
- 기본 단위: [예: 4px 배수]
- 컴포넌트 간격: [규칙]

## 3. 공통 컴포넌트

### Button
- Variant: Primary / Secondary / Ghost
- Size: sm / md / lg
- 스타일: [예: rounded-md, shadow-sm]

### Input
- 상태: Default / Focus / Error / Disabled

### Card
- 구조: [Header / Body / Footer]

### Modal
- 크기: sm / md / lg
- 닫기: X 버튼, ESC 키, 외부 클릭

## 4. 화면별 컴포넌트 구성
### [화면명]
- 사용 컴포넌트 목록
- 레이아웃 규칙

## 5. 반응형 가이드
- Desktop: [규칙]
- Tablet: [규칙]
- Mobile: [규칙]
```

#### Cursor 프롬프트 예시

```
Translate docs/02-design/wireframe.md into a UI specification
suitable for React + Tailwind CSS.

Include:
- Design system (colors, typography, spacing)
- Component library definitions
- Screen-by-screen component mapping
- Responsive breakpoints

Do not write code yet - this is a design document.
```

#### 체크포인트

- [ ] 와이어프레임의 모든 화면이 UI 명세로 변환되었는가?
- [ ] 색상, 타이포그래피, 간격이 구체적인 값으로 정의되었는가?
- [ ] 컴포넌트의 모든 상태(기본/호버/에러/비활성)가 정의되었는가?

---

### 6.5 [Phase 3-1] API 설계 (API Design)

> **목적**: 프론트엔드와 백엔드의 계약(Contract)을 정의한다. 구현 코드 없이 인터페이스만 정의한다.

#### 산출물 위치

`docs/03-architecture/api-design.md`

#### 템플릿

```markdown
# API 설계

## 1. API 개요
- Base URL: [예: /api/v1]
- 인증 방식: [예: JWT Bearer Token]
- 공통 응답 형식:

### 성공 응답
{
  "success": true,
  "data": { ... },
  "message": "..."
}

### 에러 응답
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "...",
    "details": { ... }
  }
}

### HTTP 상태 코드
- 200: 성공
- 201: 생성 성공
- 400: 잘못된 요청
- 401: 인증 실패
- 403: 권한 없음
- 404: 리소스 없음
- 500: 서버 오류

## 2. 엔드포인트

### [리소스명]

#### [METHOD] [경로]
**설명**: [한 줄 설명]

**요청**
- Headers: [필수 헤더]
- Path Parameters: [있으면 명시]
- Query Parameters: [있으면 명시]
- Body:
  {
    "field": "type - 설명"
  }

**응답**
- [상태코드]:
  {
    "응답 스키마"
  }

## 3. 에러 코드 목록

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| VALIDATION_ERROR | 400 | 입력 검증 실패 |
| ... | ... | ... |
```

#### Cursor 프롬프트 예시

```
Design RESTful APIs based on:
- docs/01-requirements/PRD.md
- docs/02-design/wireframe.md

Write only API contracts, not implementation.

For each endpoint, include:
- HTTP method and path
- Request schema (headers, params, body)
- Response schema (success and error cases)
- Example JSON for request and response

Follow REST naming conventions.
Use consistent error code system.
```

#### 체크포인트

- [ ] 사용자 스토리의 모든 액션이 API로 커버되는가?
- [ ] 요청/응답 스키마가 JSON 예시와 함께 있는가?
- [ ] 에러 케이스가 정의되어 있는가?
- [ ] 인증이 필요한 엔드포인트가 명시되어 있는가?

---

### 6.6 [Phase 3-2] DB 설계 (Database Schema)

> **목적**: 데이터 모델과 테이블 간 관계를 정의한다.

#### 산출물 위치

`docs/03-architecture/database-schema.md`

#### 템플릿

```markdown
# 데이터베이스 설계

## 1. ERD (Entity Relationship Diagram)

[Mermaid erDiagram 또는 텍스트 설명]

## 2. 테이블 정의

### [테이블명]

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 고유 식별자 |
| ... | ... | ... | ... |

**인덱스:**
- [인덱스명]: [대상 컬럼] - [목적]

**관계:**
- [다른 테이블]과 [관계 유형] (FK: [컬럼명])

## 3. 관계 정의
### One-to-Many
- [부모] → [자식]: 설명

### Many-to-Many
- [테이블A] ↔ [테이블B] (through [중간테이블])

## 4. 인덱스 전략
### 주요 쿼리 패턴
- [쿼리 설명]: [관련 인덱스]
```

#### Cursor 프롬프트 예시

```
Design a relational database schema for PostgreSQL based on:
- docs/01-requirements/PRD.md
- docs/03-architecture/api-design.md

Include:
- ERD using Mermaid syntax
- CREATE TABLE statements with constraints
- Index definitions for expected query patterns
- Foreign key relationships with ON DELETE actions
- Brief explanation of each table and relationship
```

#### 체크포인트

- [ ] API의 모든 리소스가 테이블로 매핑되었는가?
- [ ] 외래 키 관계와 ON DELETE 동작이 정의되었는가?
- [ ] 주요 쿼리 패턴에 대한 인덱스가 설계되었는가?
- [ ] 제약조건(UNIQUE, CHECK 등)이 비즈니스 규칙을 반영하는가?

---

### 6.7 [Phase 3-3] 시스템 아키텍처 (선택)

> **목적**: 시스템의 전체 구성요소와 통신 흐름을 정의한다. 프로젝트 규모가 클 때 작성한다.

#### 산출물 위치

`docs/03-architecture/system-architecture.md`

#### 포함 내용

- 기술 스택 확정 (프레임워크, 라이브러리, 인프라)
- 시스템 구성도 (Mermaid 다이어그램)
- 구성요소 간 통신 방식
- 배포 구조
- 외부 서비스 연동

---

### 6.8 [Phase 4] 개발 계획서 (Development Plan)

> **목적**: 모든 설계 문서를 종합하여 구현 순서와 마일스톤을 정한다.

#### 산출물 위치

`docs/04-implementation/development-plan.md`

#### 템플릿

```markdown
# 개발 계획

## 1. 구현 순서

### Phase 1: 프로젝트 초기 설정
- [ ] 프로젝트 스캐폴딩
- [ ] 개발 환경 설정
- [ ] DB 마이그레이션

### Phase 2: 인증 시스템
- [ ] User 모델
- [ ] 회원가입 API
- [ ] 로그인 API
- [ ] JWT 미들웨어

### Phase 3: 핵심 기능
- [ ] [기능별 구현 항목]

### Phase 4: UI 구현
- [ ] 공통 컴포넌트
- [ ] 페이지별 구현

## 2. 의존성
[어떤 기능이 어떤 기능에 의존하는지]

## 3. 마일스톤
- Milestone 1: [목표] - [기준]
- Milestone 2: [목표] - [기준]
```

#### Cursor 프롬프트 예시

```
Based on all documents in docs/, create a development plan:

1. Implementation phases with specific tasks
2. Dependencies between tasks
3. Milestones and acceptance criteria

Order tasks so that foundational pieces (DB, auth) come first,
then core features, then UI.
```

---

## 7. 코드 생성 단계: 문서에서 코드로

### 7.1 절대 원칙

```
BAD:  "이제 코드 짜줘"
GOOD: "docs/03-architecture/api-design.md의
       POST /auth/register를 구현해줘"
```

코드 생성 프롬프트에는 반드시 **세 가지**를 명시한다:

1. **참조 문서** — 어떤 설계를 기반으로 하는가
2. **구현 범위** — 어떤 기능/엔드포인트를 만드는가
3. **대상 파일** — 어떤 파일을 생성하거나 수정하는가

### 7.2 코드 생성 프롬프트 패턴

```
@docs/03-architecture/api-design.md
@docs/03-architecture/database-schema.md

Implement the GET /api/items endpoint.

Constraints:
- Follow the API design document for request/response schema
- Use the DB schema for model definitions
- Only modify src/api/items/routes.ts
- Include error handling per the error code table
```

### 7.3 단계별 구현 (컨텍스트 오버플로우 방지)

한 번에 전체를 요청하지 않는다. 기능 단위로 나누어 반복한다.

```
Step 1: "User 모델과 Auth API만 구현해줘"
  → 완료 확인
Step 2: "Project 모델과 CRUD API 구현해줘"
  → 완료 확인
Step 3: "Task 모델과 CRUD API 구현해줘"
  → 완료 확인
```

### 7.4 문서-코드 일치성 검증

구현 후 반드시 검증한다:

```
현재 구현된 코드가 다음 문서들과 일치하는지 검증해줘:
- @docs/03-architecture/api-design.md
- @docs/03-architecture/database-schema.md

불일치 사항이 있으면 목록으로 정리해줘.
```

---

## 8. 변경 관리

### 8.1 변경의 흐름

프로젝트 진행 중 요구사항이 바뀔 때:

```
요구사항 변경
  ↓
PRD 수정
  ↓
영향받는 설계 문서 수정 (API, DB 등)
  ↓
코드 반영
  ↓
changelog.md에 기록
```

**절대 하지 말 것**: 코드만 수정하고 문서를 방치. 이 순간 Doc-First는 붕괴되고 바이브 코딩으로 돌아간다.

### 8.2 변경 프롬프트 예시

```
PRD의 F3 기능(태스크 관리)에 '태그 기능'을 추가해야 해.

다음 순서로 작업해줘:
1. PRD에 기능 추가
2. 사용자 스토리 작성
3. API 설계에 태그 엔드포인트 추가
4. DB 스키마에 tags 테이블 추가
5. changelog.md에 변경 이력 기록

각 단계마다 변경 사항을 보여주고, 승인 받은 후 다음 단계로 진행해줘.
```

---

## 9. 흔한 실패 패턴과 해결책

| 실패 패턴 | 증상 | 해결책 |
|-----------|------|--------|
| 문서 안 읽고 코드 생성 | AI가 설계와 다른 구조로 코드를 만듦 | `.cursorrules`에 문서 참조 강제 규칙 추가 |
| 요구사항 변경 후 코드만 수정 | 문서와 코드가 점점 괴리됨 | 변경 시 문서 먼저 수정하는 워크플로우 고정 |
| AI가 매번 다른 스타일로 생성 | 파일마다 네이밍, 구조가 제각각 | `.cursorrules`에 코딩 컨벤션 명시 |
| 한 번에 전체 구현 요청 | 컨텍스트 오버플로우, 불완전한 코드 | 기능 단위로 분할 요청 |
| 모호한 프롬프트 | "코드 짜줘" → 의도와 다른 결과 | 참조 문서 + 범위 + 대상 파일 항상 명시 |
| Cursor가 문서를 참조하지 않음 | 설계와 무관한 코드 생성 | `@docs/파일명` 으로 명시적 멘션 |

---

## 10. 전체 체크리스트

### 프로젝트 시작 시

- [ ] 문서 디렉토리 구조 생성 (`docs/01~04`)
- [ ] `.cursorrules` 파일 작성
- [ ] 기술 스택 확정

### Phase 1: 요구사항

- [ ] PRD 작성 및 검토
- [ ] 사용자 스토리 작성
- [ ] 우선순위 설정 (P0/P1/P2)

### Phase 2: 설계

- [ ] 텍스트 와이어프레임 작성
- [ ] UI 디자인 명세 작성
- [ ] 디자인 시스템 정의

### Phase 3: 기술 설계

- [ ] API 설계 완료
- [ ] DB 스키마 설계 완료
- [ ] 시스템 아키텍처 문서 (필요 시)

### Phase 4: 구현

- [ ] 개발 계획 수립
- [ ] 기능별 반복 구현 (문서 참조 → 코드 생성 → 검증)
- [ ] 코드 생성 후 문서와 일치성 검증

### 유지보수

- [ ] 변경 시 문서 먼저 수정
- [ ] 영향받는 모든 문서 동기화
- [ ] changelog.md 업데이트

---

## 11. 마무리

### 한 줄 요약

> **AI 코딩 도구는 코드 생성기가 아니라 문서-코드 번역기다. 문서를 잘 쓰는 사람이 가장 좋은 코드를 만든다.**

### Doc-First AI Development의 본질

이 방법론의 핵심은 AI를 더 잘 다루는 것이 아니다. **생각을 더 잘 정리하는 것**이다. PRD를 쓰면서 요구사항을 명확히 하고, 와이어프레임을 그리면서 사용자 흐름을 검증하고, API를 설계하면서 데이터 흐름을 확인한다. 이 과정을 거치면 코드는 자연스럽게 따라온다 -- AI가 있든 없든.

AI는 이 과정을 **극적으로 가속**할 뿐이다.
