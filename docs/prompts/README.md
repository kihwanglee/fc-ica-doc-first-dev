# Doc-First AI Development: 프롬프트 모음

> 이 디렉토리는 TaskFlow 프로젝트를 Doc-First 방법론으로 개발할 때 각 단계에서 사용할 프롬프트를 단계별로 정리한 것입니다.
> 각 프롬프트는 Cursor, Claude Code 등 AI 코딩 도구에서 그대로 사용할 수 있습니다.

---

## 📚 프롬프트 파일 구조

프로젝트 개발은 시간적·논리적 순서를 따라 진행되며, 각 단계별로 프롬프트가 분리되어 있습니다.

| 단계 | 파일 | 설명 | 주요 산출물 |
|:----:|------|------|-------------|
| **1** | [01-requirements-prompts.md](./01-requirements-prompts.md) | 요구사항 정의 | PRD, 사용자 스토리 |
| **2** | [02-design-prompts.md](./02-design-prompts.md) | UI/UX 설계 | 와이어프레임, UI 디자인 명세 |
| **3** | [03-architecture-prompts.md](./03-architecture-prompts.md) | 시스템 아키텍처 | API 설계, DB 스키마 |
| **4** | [04-planning-prompts.md](./04-planning-prompts.md) | 개발 계획 수립 | 개발 계획서 |
| **5** | [05-implementation-prompts.md](./05-implementation-prompts.md) | 코드 구현 | 백엔드/프론트엔드 코드 |
| **6** | [06-testing-prompts.md](./06-testing-prompts.md) | 테스트 작성 | 스모크/통합/E2E 테스트 |
| **7** | [07-deployment-prompts.md](./07-deployment-prompts.md) | 배포 | 프로덕션 설정, 배포 스크립트 |
| **8** | [08-maintenance-prompts.md](./08-maintenance-prompts.md) | 유지보수 | 변경 요청, 버그 수정, 리팩토링 |

---

## 🚀 사용 방법

### 순차적 개발 (처음부터 끝까지)

프로젝트를 처음 시작하는 경우, 위 표의 순서대로 각 파일을 열어 프롬프트를 실행하세요:

```
1단계 (요구사항) → 2단계 (설계) → 3단계 (아키텍처) → ... → 8단계 (유지보수)
```

각 단계는 이전 단계의 산출물을 참조하므로, **순서대로 진행하는 것이 중요합니다**.

### 특정 작업만 수행

이미 진행 중인 프로젝트에서 특정 작업만 필요한 경우:

- **새 기능 추가:** 08-maintenance-prompts.md → "변경 요청 템플릿" 사용
- **버그 수정:** 08-maintenance-prompts.md → "버그 수정 프롬프트" 사용
- **테스트 추가:** 06-testing-prompts.md 참조
- **배포 설정:** 07-deployment-prompts.md 참조

---

## 📖 각 파일 상세 설명

### [01-requirements-prompts.md](./01-requirements-prompts.md)
**목적:** 프로젝트가 "무엇을" 만들지 정의
- PRD(Product Requirements Document) 생성
- 사용자 스토리(User Story) 작성
- 구현 방법은 아직 다루지 않음

**예상 소요 시간:** 30분 ~ 1시간

---

### [02-design-prompts.md](./02-design-prompts.md)
**목적:** 사용자가 볼 화면 설계
- 텍스트 기반 와이어프레임 작성 (ASCII 아트)
- UI 디자인 명세 (색상, 컴포넌트, 레이아웃)
- 아직 코드는 작성하지 않음

**예상 소요 시간:** 1 ~ 2시간

---

### [03-architecture-prompts.md](./03-architecture-prompts.md)
**목적:** 시스템의 기술적 구조 설계
- RESTful API 엔드포인트 정의
- 데이터베이스 스키마 설계 (ERD, 테이블 정의)
- 프론트엔드-백엔드 간 계약(Contract) 명시

**예상 소요 시간:** 1 ~ 2시간

---

### [04-planning-prompts.md](./04-planning-prompts.md)
**목적:** 구현 로드맵 수립
- Phase별 작업 분할
- 작업 순서와 의존성 정리
- 마일스톤 설정

**예상 소요 시간:** 30분 ~ 1시간

---

### [05-implementation-prompts.md](./05-implementation-prompts.md)
**목적:** 실제 코드 작성
- Docker 환경 설정
- 백엔드 구현 (인증, CRUD API)
- 프론트엔드 구현 (페이지, 컴포넌트)

**예상 소요 시간:** 8 ~ 16시간 (AI 활용 시)

---

### [06-testing-prompts.md](./06-testing-prompts.md)
**목적:** 구현된 기능 검증
- API 스모크 테스트 (curl 기반)
- 통합 테스트 (pytest)
- E2E 테스트 (Playwright)

**예상 소요 시간:** 2 ~ 4시간

---

### [07-deployment-prompts.md](./07-deployment-prompts.md)
**목적:** 운영 환경 배포
- 프로덕션 설정 파일 생성 (docker-compose.prod.yml, Nginx)
- 배포 스크립트 작성
- 모니터링/백업 스크립트

**예상 소요 시간:** 40분 ~ 1시간 (AI 활용 시)

**참고:** 배포 전체 워크플로우는 `docs/tutorial/deployment-guide.md`를 참조하세요.

---

### [08-maintenance-prompts.md](./08-maintenance-prompts.md)
**목적:** 운영 중 발생하는 작업 처리
- 기능 변경/추가 요청
- 버그 수정
- 리팩토링
- 성능 최적화
- 보안 점검
- 문서 업데이트

**소요 시간:** 작업 성격에 따라 다름

---

## 💡 Doc-First 방법론의 핵심 원칙

1. **문서 우선 작성:** 코드를 작성하기 전에 반드시 관련 문서를 먼저 작성합니다.
2. **문서를 기준으로 구현:** AI에게 프롬프트를 줄 때 문서 경로를 명시하고, 문서를 참조하게 합니다.
3. **문서와 코드의 일치:** 코드와 문서가 불일치할 경우, 문서를 우선으로 합니다.
4. **변경 시 문서부터 업데이트:** 기능을 변경할 때는 문서를 먼저 업데이트한 후 코드를 수정합니다.

---

## 🔄 프롬프트 사용 팁

### 1. 문서 경로를 명확히 지정하세요
```
✅ 좋은 예: "docs/03-architecture/api-design.md를 참조하여..."
❌ 나쁜 예: "API 설계 문서를 보고..."
```

### 2. 산출물 파일 경로를 명시하세요
```
✅ 좋은 예: "파일 위치: backend/app/models/user.py"
❌ 나쁜 예: "user 모델 파일을 만들어줘"
```

### 3. 프롬프트를 그대로 복사-붙여넣기하세요
- 각 프롬프트는 독립적으로 사용 가능하도록 작성되었습니다.
- 필요에 따라 프로젝트 상황에 맞게 수정하여 사용하세요.

### 4. 단계를 건너뛰지 마세요
- 각 단계는 이전 단계의 산출물에 의존합니다.
- 순서를 지키면 AI가 더 정확한 결과를 생성합니다.

---

## 🤝 기여 및 개선

프롬프트 개선 아이디어가 있다면:
1. GitHub Issue로 제안하거나
2. Pull Request를 보내주세요

---

## 📚 추가 참고 자료

- **프로젝트 규칙:** `.claude/rules/taskflow.md` - 코딩 컨벤션, 기술 스택
- **배포 가이드:** `docs/tutorial/deployment-guide.md` - 전체 배포 워크플로우
- **Doc-First 튜토리얼:** `docs/tutorial/doc-first-ai-dev.md` - 방법론 상세 설명

---

**마지막 업데이트:** 2026-02-07
