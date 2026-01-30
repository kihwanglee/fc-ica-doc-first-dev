# GitHub 협업 실습 가이드
( GitHub + GitHub Desktop + Cursor )

본 문서는 **강의 중 실습용 자료**입니다.  
실제 코드 실행 없이, 협업 흐름과 역할 이해에 초점을 둡니다.

---

## 공통 목표

- 브랜치 기반 협업 흐름 이해
- Pull Request(PR)를 통한 리뷰·합의 경험
- 문서도 코드처럼 협업 자산으로 관리

---

## 사전 준비

- GitHub 계정
- GitHub Desktop 설치
- Cursor 설치

---

## 기본 저장소 구조 (예시)

```
project-root/
├─ README.md
├─ docs/
│  ├─ brainstorming.md
│  ├─ prd.md
│  └─ api-spec.md
└─ src/
```

---

# 시나리오 1: 기획 문서 협업

## 상황

- PM이 빈 프로젝트 저장소를 생성
- 기획자가 브랜치에서 기획 문서를 작성
- PR을 통해 전체 공유 및 병합

## 실습 단계

1. PM이 GitHub에서 새 저장소 생성
2. 기획자 역할 수강자
   - GitHub Desktop으로 저장소 Clone
   - `feature/plan-이름` 브랜치 생성
3. Cursor에서 아래 문서를 생성했다고 가정
   - `docs/brainstorming.md`
   - `docs/prd.md`
4. Commit 메시지 예시
   - `Add initial brainstorming and PRD`
5. Push 후 Pull Request 생성
6. PM 역할 수강자는 PR을 읽고 Merge
7. 다른 참여자는 main 브랜치 Pull

## 체크 포인트

- PR은 “완성본”이 아니라 “공유와 합의의 시작”

---

# 시나리오 2: 기능 개발 브랜치 공유

> 실제 코드 실행 없음 (상황 가정)

## 상황

- 개발자가 로그인 기능 브랜치 생성
- 다른 참여자가 브랜치를 내려받아 리뷰
- PR 생성 후 병합

## 실습 단계

1. 개발자 역할 수강자
   - `feature/login-이름` 브랜치 생성
2. Cursor로 로그인 코드 초안 생성했다고 가정
3. Commit 메시지 예시
   - `Add login feature skeleton`
4. Push
5. 다른 참여자
   - 해당 브랜치 Pull
   - “로컬에서 실행해본다”고 가정
6. 개발자가 PR 생성
7. PM 역할 수강자가 main에 Merge

## 체크 포인트

- PR 이전에도 브랜치 공유는 가능
- 리뷰는 코드 실행이 없어도 가능

---

# 시나리오 3: PR 기반 수정 요청

## 상황

- API 사양 문서를 PR로 공유
- 리뷰 요청 → 수정 → 재커밋
- 동일 PR에서 반복 반영

## 실습 단계

1. 개발자 역할 수강자
   - `feature/api-이름` 브랜치 생성
2. `docs/api-spec.md` 작성
3. Commit & Push
4. PR 생성
5. 리뷰어 역할 수강자
   - 수정 요청 코멘트 작성
6. 개발자
   - 같은 브랜치에서 문서 수정
   - Commit & Push
7. PR 자동 갱신 확인
8. PM 역할 수강자가 Merge

## 체크 포인트

- PR은 닫지 않고 계속 업데이트
- 커밋은 PR의 히스토리

---

# 시나리오 4: 충돌(Conflict) 해결

## 상황

- 두 명이 같은 파일을 동시에 수정
- 먼저 Merge된 PR과 충돌 발생
- 충돌을 해결하고 다시 Merge

## 실습 단계

1. 수강자 A
   - `feature/readme-A` 브랜치 생성
   - `README.md`에 "프로젝트 소개: A 버전" 추가
   - Commit & Push → PR 생성 → Merge
2. 수강자 B (A와 동시에 시작했다고 가정)
   - `feature/readme-B` 브랜치 생성
   - `README.md`에 "프로젝트 소개: B 버전" 추가
   - Commit & Push → PR 생성
3. GitHub에서 충돌 경고 확인
4. 수강자 B의 충돌 해결
   - GitHub Desktop에서 main 브랜치 Pull
   - 자신의 브랜치에서 main Merge 시도
   - 충돌 파일 확인 (<<<<<<< / ======= / >>>>>>> 마커)
   - Cursor에서 충돌 해결 (양쪽 내용 통합)
   - Commit & Push
5. PR 자동 갱신 → Merge 가능 상태 확인
6. PM이 Merge

## 체크 포인트

- 충돌은 "실수"가 아니라 "자연스러운 협업 과정"
- 충돌 해결은 최신 main을 먼저 받아오는 것이 핵심
- GitHub Desktop이 충돌 파일을 시각적으로 표시해줌

---

# 시나리오 5: Issue 기반 작업 관리

## 상황

- PM이 해야 할 작업을 Issue로 등록
- 담당자가 Issue를 브랜치와 연결하여 작업
- PR로 Issue 자동 종료

## 실습 단계

1. PM 역할 수강자
   - GitHub에서 Issue 생성
   - 제목: "로그인 페이지 UI 개선"
   - 본문: 구체적인 요구사항 작성
   - Labels 추가 (enhancement, documentation 등)
   - Assignees 지정
2. 개발자 역할 수강자
   - Issue 번호 확인 (예: #3)
   - `feature/3-login-ui` 브랜치 생성 (Issue 번호 포함)
3. 작업 완료 후 PR 생성
   - PR 본문에 `Closes #3` 또는 `Fixes #3` 작성
4. Merge 후 Issue 자동 종료 확인

## 체크 포인트

- Issue는 "할 일 목록"이자 "논의 공간"
- 브랜치명에 Issue 번호를 넣으면 추적이 쉬움
- `Closes #번호`로 PR과 Issue 연결

---

# 시나리오 6: Fork & Pull Request (오픈소스 기여 방식)

## 상황

- 외부 저장소에 기여하고 싶을 때
- 직접 Push 권한이 없는 경우
- Fork → 수정 → PR 요청

## 실습 단계

1. 강사가 공개 저장소 준비
2. 수강자
   - GitHub에서 Fork 버튼 클릭
   - 자신의 계정에 복사본 생성됨
3. Fork된 저장소를 GitHub Desktop으로 Clone
4. 브랜치 생성 → 수정 → Commit → Push
5. GitHub에서 "Contribute" → "Open Pull Request"
   - base repository: 원본 저장소
   - head repository: 내 Fork
6. 강사(원본 소유자)가 PR 리뷰 및 Merge

## 체크 포인트

- Fork는 "내 소유의 복사본"
- 원본 저장소에 직접 Push하지 않고도 기여 가능
- 오픈소스 프로젝트 기여의 표준 방식

---

## 실무 팁: 컨벤션 가이드

### 브랜치 네이밍

| 접두어 | 용도 | 예시 |
|--------|------|------|
| `feature/` | 새 기능 | `feature/login` |
| `fix/` | 버그 수정 | `fix/header-overflow` |
| `docs/` | 문서 작업 | `docs/api-guide` |
| `refactor/` | 코드 개선 | `refactor/auth-module` |

### 커밋 메시지 작성법 (Conventional Commits)

```
<타입>: <간단한 설명>

[선택] 본문: 왜 이 변경이 필요한지

[선택] 관련 Issue: #123
```

**타입 예시:**
- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가

**좋은 예:**
```
feat: 로그인 폼 유효성 검사 추가

이메일 형식과 비밀번호 최소 길이 검증
Closes #15
```

### PR 작성 템플릿

```markdown
## 변경 사항
- 무엇을 변경했는지

## 변경 이유
- 왜 이 변경이 필요한지

## 테스트 방법
- 어떻게 확인할 수 있는지

## 관련 Issue
- Closes #이슈번호
```

---

## 마무리 정리

| 개념 | 핵심 포인트 |
|------|-------------|
| 브랜치 | 역할과 목적 단위로 분리 |
| PR | 코드 공유 + 리뷰 + 합의의 도구 |
| Issue | 작업 단위 관리 및 논의 공간 |
| Conflict | 자연스러운 협업 과정, 두려워하지 말 것 |
| Fork | 권한 없이도 기여할 수 있는 방법 |
| 컨벤션 | 팀의 일관성을 위한 약속 |

### 도구별 역할

- **GitHub**: 중앙 저장소, PR/Issue 관리, 협업 허브
- **GitHub Desktop**: Git 명령어 없이 시각적으로 버전 관리
- **Cursor**: AI 기반 코드/문서 작성 보조

### 협업의 핵심 원칙

1. **작은 단위로 자주 커밋** - 큰 변경은 리뷰가 어려움
2. **PR은 빨리 만들고, 자주 업데이트** - 완성 후가 아니라 진행 중에도 공유
3. **리뷰는 비판이 아니라 개선 제안** - 건설적인 피드백 문화
4. **main 브랜치는 항상 안정적으로** - 직접 Push 금지 권장

---

## 참고 자료

- [GitHub Docs - Hello World](https://docs.github.com/en/get-started/quickstart/hello-world)
- [GitHub Desktop 사용법](https://docs.github.com/en/desktop)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

(끝)
