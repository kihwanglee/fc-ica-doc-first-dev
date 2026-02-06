# 2단계: 설계 프롬프트

> 요구사항을 바탕으로 사용자 인터페이스와 화면 구조를 설계하는 프롬프트입니다.

---

## 2-1. 텍스트 와이어프레임 생성

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

## 2-2. UI 디자인 명세 생성

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
