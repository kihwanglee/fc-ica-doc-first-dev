# 6단계: 테스트 프롬프트

> 구현된 기능을 검증하기 위한 테스트 코드를 생성하는 프롬프트입니다.

---

## 6-1. curl 기반 API 스모크 테스트 생성

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

## 6-2. Python API 통합 테스트 생성

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

## 6-3. Playwright E2E 테스트 생성

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
