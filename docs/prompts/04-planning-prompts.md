# 4단계: 개발 계획 수립 프롬프트

> 설계 문서를 바탕으로 구현 로드맵과 작업 순서를 계획하는 프롬프트입니다.

---

## 4-1. 개발 계획 수립

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
