# UI 디자인 스펙 (UI Design Specification)

## 프로젝트: TaskFlow — 태스크 관리 SaaS

> 기술 스택: Next.js + TypeScript + Tailwind CSS

---

## 1. 디자인 원칙

| 원칙 | 설명 |
|------|------|
| **명확성 (Clarity)** | 사용자가 현재 상태와 다음 행동을 즉시 파악할 수 있어야 한다 |
| **일관성 (Consistency)** | 동일한 패턴은 동일한 컴포넌트로 표현한다 |
| **효율성 (Efficiency)** | 최소한의 클릭으로 핵심 작업을 완료할 수 있어야 한다 |
| **접근성 (Accessibility)** | WCAG 2.1 AA 기준을 충족한다 |
| **반응성 (Responsiveness)** | 데스크톱, 태블릿, 모바일 모두 지원한다 |

---

## 2. 디자인 시스템

### 2.1 색상 (Colors)

#### 기본 색상

| 용도 | 색상 | Hex | Tailwind Class |
|------|------|-----|----------------|
| Primary | 인디고 | `#4F46E5` | `bg-indigo-600` / `text-indigo-600` |
| Primary Hover | 진한 인디고 | `#4338CA` | `bg-indigo-700` |
| Primary Light | 연한 인디고 | `#EEF2FF` | `bg-indigo-50` |
| Secondary | 슬레이트 | `#475569` | `bg-slate-600` / `text-slate-600` |

#### 상태 색상

| 용도 | 색상 | Hex | Tailwind Class |
|------|------|-----|----------------|
| Success | 에메랄드 | `#059669` | `bg-emerald-600` / `text-emerald-600` |
| Warning | 앰버 | `#D97706` | `bg-amber-600` / `text-amber-600` |
| Error | 레드 | `#DC2626` | `bg-red-600` / `text-red-600` |
| Info | 블루 | `#2563EB` | `bg-blue-600` / `text-blue-600` |

#### 중립 색상

| 용도 | Hex | Tailwind Class |
|------|-----|----------------|
| 배경 (페이지) | `#F8FAFC` | `bg-slate-50` |
| 배경 (카드) | `#FFFFFF` | `bg-white` |
| 배경 (컬럼) | `#F1F5F9` | `bg-slate-100` |
| 보더 | `#E2E8F0` | `border-slate-200` |
| 텍스트 (Primary) | `#0F172A` | `text-slate-900` |
| 텍스트 (Secondary) | `#64748B` | `text-slate-500` |
| 텍스트 (Placeholder) | `#94A3B8` | `text-slate-400` |

#### 우선순위 색상

| 우선순위 | 배경 | 텍스트 | Tailwind Class |
|----------|------|--------|----------------|
| URGENT | 연한 빨강 | 빨강 | `bg-red-100 text-red-700` |
| HIGH | 연한 주황 | 주황 | `bg-orange-100 text-orange-700` |
| MEDIUM | 연한 노랑 | 노랑 | `bg-yellow-100 text-yellow-700` |
| LOW | 연한 초록 | 초록 | `bg-green-100 text-green-700` |

### 2.2 타이포그래피 (Typography)

기본 폰트: `font-sans` (Inter 또는 시스템 폰트)

| 용도 | 크기 | 굵기 | Tailwind Class |
|------|------|------|----------------|
| 페이지 제목 (H1) | 30px | Bold | `text-3xl font-bold` |
| 섹션 제목 (H2) | 24px | Semibold | `text-2xl font-semibold` |
| 카드 제목 (H3) | 18px | Semibold | `text-lg font-semibold` |
| 본문 (Body) | 14px | Normal | `text-sm font-normal` |
| 본문 (Body Large) | 16px | Normal | `text-base font-normal` |
| 캡션 | 12px | Normal | `text-xs font-normal` |
| 라벨 | 14px | Medium | `text-sm font-medium` |

### 2.3 간격 (Spacing)

Tailwind의 기본 spacing scale을 사용한다.

| 용도 | 값 | Tailwind Class |
|------|-----|----------------|
| 컴포넌트 내부 패딩 (소) | 8px | `p-2` |
| 컴포넌트 내부 패딩 (중) | 12px | `p-3` |
| 컴포넌트 내부 패딩 (대) | 16px | `p-4` |
| 카드 내부 패딩 | 16px ~ 24px | `p-4` ~ `p-6` |
| 요소 간 간격 (소) | 8px | `gap-2` / `space-y-2` |
| 요소 간 간격 (중) | 16px | `gap-4` / `space-y-4` |
| 요소 간 간격 (대) | 24px | `gap-6` / `space-y-6` |
| 페이지 컨테이너 패딩 | 24px ~ 32px | `px-6` ~ `px-8` |

### 2.4 둥글기 및 그림자

| 용도 | Tailwind Class |
|------|----------------|
| 버튼 | `rounded-lg` (8px) |
| 입력 필드 | `rounded-lg` (8px) |
| 카드 | `rounded-xl` (12px) |
| 모달 | `rounded-2xl` (16px) |
| 아바타 | `rounded-full` |
| 카드 그림자 | `shadow-sm` |
| 카드 호버 그림자 | `shadow-md` |
| 모달 그림자 | `shadow-xl` |
| 드래그 중 그림자 | `shadow-lg` |

---

## 3. 공통 컴포넌트

### 3.1 Button

#### Variants

```tsx
// Primary
<button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium
  py-2 px-4 rounded-lg transition-colors duration-150
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed">
  버튼 텍스트
</button>

// Secondary
<button className="bg-white hover:bg-slate-50 text-slate-700 font-medium
  py-2 px-4 rounded-lg border border-slate-300 transition-colors duration-150
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
  버튼 텍스트
</button>

// Danger
<button className="bg-red-600 hover:bg-red-700 text-white font-medium
  py-2 px-4 rounded-lg transition-colors duration-150
  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
  삭제
</button>

// Ghost
<button className="text-slate-600 hover:text-slate-900 hover:bg-slate-100
  font-medium py-2 px-4 rounded-lg transition-colors duration-150">
  버튼 텍스트
</button>
```

#### 크기

| 크기 | Tailwind Class |
|------|----------------|
| Small | `py-1.5 px-3 text-sm` |
| Medium (기본) | `py-2 px-4 text-sm` |
| Large | `py-2.5 px-5 text-base` |

### 3.2 Input

```tsx
<div>
  <label className="block text-sm font-medium text-slate-700 mb-1">
    라벨
  </label>
  <input
    type="text"
    className="w-full px-3 py-2 border border-slate-300 rounded-lg
      text-sm text-slate-900 placeholder:text-slate-400
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
      disabled:bg-slate-50 disabled:text-slate-500"
    placeholder="플레이스홀더"
  />
  {/* 에러 상태 */}
  <p className="mt-1 text-sm text-red-600">에러 메시지</p>
</div>
```

에러 상태의 입력 필드:

```tsx
<input className="... border-red-500 focus:ring-red-500 focus:border-red-500" />
```

### 3.3 Card

```tsx
<div className="bg-white rounded-xl border border-slate-200 shadow-sm
  hover:shadow-md transition-shadow duration-200 p-6 cursor-pointer">
  <h3 className="text-lg font-semibold text-slate-900">프로젝트 이름</h3>
  <p className="mt-1 text-sm text-slate-500">프로젝트 설명</p>
  <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
    <span>멤버: 5명</span>
    <span>태스크: 24개</span>
  </div>
</div>
```

### 3.4 Modal

```tsx
{/* 오버레이 */}
<div className="fixed inset-0 bg-black/50 z-40" />

{/* 모달 */}
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
    {/* 헤더 */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">모달 제목</h2>
      <button className="text-slate-400 hover:text-slate-600">
        ✕
      </button>
    </div>

    {/* 본문 */}
    <div className="px-6 py-4">
      {/* 콘텐츠 */}
    </div>

    {/* 푸터 */}
    <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
      <button className="...secondary">취소</button>
      <button className="...primary">확인</button>
    </div>
  </div>
</div>
```

### 3.5 TaskCard (칸반 보드용)

```tsx
<div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3
  cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow
  active:shadow-lg active:scale-[1.02]">
  {/* 우선순위 뱃지 */}
  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
    bg-red-100 text-red-700">
    URGENT
  </span>

  {/* 제목 */}
  <h4 className="mt-2 text-sm font-medium text-slate-900 line-clamp-2">
    로그인 페이지 구현
  </h4>

  {/* 하단: 담당자 */}
  <div className="mt-3 flex items-center justify-between">
    <div className="flex items-center gap-1.5">
      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center
        justify-center text-xs font-medium text-indigo-700">
        이
      </div>
      <span className="text-xs text-slate-500">이정호</span>
    </div>
  </div>
</div>
```

### 3.6 Badge (상태 뱃지)

```tsx
// TODO
<span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
  TODO
</span>

// IN PROGRESS
<span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
  IN PROGRESS
</span>

// DONE
<span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
  DONE
</span>
```

### 3.7 Toast (알림 메시지)

```tsx
<div className="fixed bottom-4 right-4 z-50 flex items-center gap-2
  bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm">
  <span>✓</span>
  <span>저장되었습니다</span>
</div>
```

---

## 4. 화면별 컴포넌트 구성

### 4.1 로그인 화면 (`/login`)

```
Layout: 전체 화면 중앙 정렬 (flex items-center justify-center min-h-screen bg-slate-50)
└── AuthCard (w-full max-w-md bg-white rounded-2xl shadow-sm p-8)
    ├── Logo (text-2xl font-bold text-indigo-600)
    ├── Input (이메일)
    ├── Input (비밀번호)
    ├── Button (Primary, 전체 너비)
    └── Link (회원가입)
```

### 4.2 대시보드 (`/dashboard`)

```
Layout: min-h-screen bg-slate-50
├── Header (sticky top-0 bg-white border-b)
│   ├── Logo
│   ├── Spacer
│   ├── NotificationIcon
│   └── ProfileDropdown
└── Main (max-w-7xl mx-auto px-6 py-8)
    ├── SectionHeader
    │   ├── Title ("내 프로젝트")
    │   └── Button (Primary, "+ 새 프로젝트")
    └── ProjectGrid (grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6)
        ├── ProjectCard
        ├── ProjectCard
        └── ...
```

### 4.3 프로젝트 보드 (`/projects/[id]`)

```
Layout: min-h-screen bg-slate-50 flex flex-col
├── Header (동일)
├── BoardHeader (bg-white border-b px-6 py-3)
│   ├── BackLink (← 대시보드)
│   ├── ProjectTitle
│   ├── Spacer
│   ├── SettingsButton
│   └── MembersButton
├── FilterBar (bg-white border-b px-6 py-2)
│   ├── FilterDropdown (담당자)
│   ├── FilterDropdown (우선순위)
│   ├── ResetButton
│   ├── Spacer
│   └── Button (Primary, "+ 태스크")
└── BoardContent (flex-1 overflow-x-auto px-6 py-6)
    └── ColumnContainer (flex gap-6)
        ├── Column (w-80 bg-slate-100 rounded-xl p-4)
        │   ├── ColumnHeader ("TODO" + count)
        │   ├── TaskCard
        │   ├── TaskCard
        │   └── AddButton
        ├── Column ("IN PROGRESS")
        └── Column ("DONE")
```

### 4.4 태스크 상세 사이드 패널

```
Overlay (fixed inset-0 bg-black/30)
Panel (fixed right-0 top-0 h-full w-[480px] bg-white shadow-xl)
├── PanelHeader (flex justify-between items-center px-6 py-4 border-b)
│   ├── Title ("태스크 상세")
│   └── CloseButton
├── PanelBody (px-6 py-6 space-y-6 overflow-y-auto)
│   ├── Input (제목, text-lg font-semibold)
│   ├── FieldGroup (flex gap-4)
│   │   ├── Select (상태)
│   │   └── Select (우선순위)
│   ├── Select (담당자)
│   ├── Textarea (설명)
│   └── MetaInfo (생성일, 수정일)
└── PanelFooter (flex justify-between px-6 py-4 border-t)
    ├── Button (Danger, "삭제")
    └── Button (Primary, "저장")
```

---

## 5. 반응형 가이드

### 5.1 브레이크포인트

| 이름 | 최소 너비 | Tailwind Prefix | 대상 기기 |
|------|-----------|-----------------|-----------|
| Mobile | 0px | (기본) | 스마트폰 |
| Tablet | 768px | `md:` | 태블릿 |
| Desktop | 1024px | `lg:` | 데스크톱 |
| Wide | 1280px | `xl:` | 와이드 모니터 |

### 5.2 화면별 반응형 동작

#### 대시보드

| 요소 | Mobile | Tablet | Desktop |
|------|--------|--------|---------|
| 프로젝트 그리드 | 1열 `grid-cols-1` | 2열 `md:grid-cols-2` | 3열 `lg:grid-cols-3` |
| 헤더 | 로고 축약 | 전체 로고 | 전체 로고 |
| 컨테이너 패딩 | `px-4` | `px-6` | `px-8` |

#### 칸반 보드

| 요소 | Mobile | Tablet | Desktop |
|------|--------|--------|---------|
| 컬럼 레이아웃 | 세로 스택 (탭 전환) | 가로 스크롤 | 3열 나란히 |
| 컬럼 너비 | 전체 너비 | `w-72` | `w-80` |
| 필터 바 | 아이콘만 표시 | 축약 텍스트 | 전체 텍스트 |
| 태스크 생성 | FAB (우하단 플로팅) | 헤더 버튼 | 헤더 버튼 + 컬럼 하단 |

#### 태스크 상세 패널

| 요소 | Mobile | Tablet/Desktop |
|------|--------|----------------|
| 표시 방식 | 전체 화면 (`w-full`) | 사이드 패널 (`w-[480px]`) |
| 열림 방향 | 아래에서 위로 슬라이드 | 오른쪽에서 슬라이드 |

### 5.3 모바일 특화 고려사항

1. **터치 타겟 최소 크기**: 44x44px (`min-h-[44px] min-w-[44px]`)
2. **드래그앤드롭**: 모바일에서는 롱프레스(500ms) 후 드래그 시작
3. **스와이프**: 보드뷰에서 컬럼 간 좌우 스와이프 지원
4. **키보드 회피**: 입력 필드 포커스 시 가상 키보드에 의해 가려지지 않도록 스크롤 조정
5. **Safe Area**: iPhone 노치/홈 인디케이터 대응 (`env(safe-area-inset-*)`)
