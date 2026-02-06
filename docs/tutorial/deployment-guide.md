# 배포(Deployment) 교육 및 실습 가이드

> **대상:** TaskFlow(Next.js + FastAPI + PostgreSQL) 프로젝트를 실제 서비스로 배포하는 방법을 학습합니다.
> **소요 시간:** 약 60분 (강의 + 시연)
> **사전 준비:** Docker 사용 경험, 기본적인 터미널 명령어 숙지

---

## 목차

| 순서 | 주제 | 시간 |
|------|------|------|
| 1 | [배포란 무엇인가?](#1-배포란-무엇인가) | 5분 |
| 2 | [배포 방식의 종류](#2-배포-방식의-종류) | 5분 |
| 3 | [TaskFlow는 왜 Vercel만으로 배포할 수 없는가?](#3-taskflow는-왜-vercel만으로-배포할-수-없는가) | 5분 |
| 3.5 | [Vercel을 최대한 활용하는 기술 스택](#35-vercel을-최대한-활용하는-기술-스택) | 10분 |
| 4 | [방법 A — Vercel + 외부 서비스 조합 배포](#4-방법-a--vercel--외부-서비스-조합-배포) | 15분 |
| 5 | [방법 B — AWS EC2 + Docker 올인원 배포](#5-방법-b--aws-ec2--docker-올인원-배포) | 20분 |
| 6 | [Nginx의 역할과 도입](#6-nginx의-역할과-도입) | 5분 |
| 7 | [정리 및 비교](#7-정리-및-비교) | 5분 |

---

## 1. 배포란 무엇인가?

### 1.1 배포의 정의

**배포(Deployment)** 란, 개발 환경(내 컴퓨터)에서만 동작하던 애플리케이션을 **인터넷을 통해 누구나 접속할 수 있는 서버 환경에 올려서 실행하는 과정**을 말합니다.

```
┌──────────────┐                          ┌──────────────────────┐
│   개발 환경   │    ──── 배포 ────▶       │     운영(Production)  │
│  (localhost)  │                          │   (https://my-app.com)│
│  내 PC에서만  │                          │    전 세계에서 접속    │
│  접속 가능    │                          │       가능            │
└──────────────┘                          └──────────────────────┘
```

### 1.2 배포가 필요한 이유

| 개발 환경 | 운영 환경 |
|-----------|-----------|
| `localhost:3000`으로 접속 | `https://taskflow.com`으로 접속 |
| 내 컴퓨터가 꺼지면 서비스 중단 | 24시간 365일 실행 |
| 나만 접속 가능 | 전 세계 사용자 접속 가능 |
| 개발용 설정 (디버그 모드, 핫 리로드) | 운영용 설정 (최적화, 보안 강화) |

### 1.3 배포 과정에서 달라지는 것들

개발 환경과 운영 환경은 근본적으로 다릅니다. 배포할 때 반드시 고려해야 할 사항들입니다:

1. **환경 변수 변경** — `localhost` → 실제 도메인/IP 주소
2. **보안 강화** — JWT 시크릿 변경, HTTPS 적용, 디버그 모드 비활성화
3. **성능 최적화** — 프로덕션 빌드, 캐싱, 정적 파일 최적화
4. **안정성 확보** — 프로세스 자동 재시작, 로그 관리, 모니터링

### 1.4 TaskFlow의 기술 스택 확인

우리 프로젝트의 구성 요소를 확인합니다:

```
TaskFlow 프로젝트
├── frontend/     ← Next.js 14 (React 프레임워크)   ... 포트 3000
├── backend/      ← FastAPI (Python API 서버)        ... 포트 8000
├── db            ← PostgreSQL 16 (데이터베이스)     ... 포트 5432
└── docker-compose.yml  ← 3개 서비스를 한번에 실행
```

이 세 가지 구성 요소를 **모두** 인터넷에서 접근 가능한 상태로 만드는 것이 배포입니다.

---

## 2. 배포 방식의 종류

### 2.1 PaaS (Platform as a Service) — 플랫폼 서비스 이용

특정 플랫폼에 코드를 올리면 **빌드, 실행, 스케일링을 플랫폼이 알아서 해주는** 방식입니다.

| 서비스 | 주요 용도 | 무료 티어 |
|--------|-----------|-----------|
| **Vercel** | Next.js / React 프론트엔드 | O (취미 용도) |
| **Render** | 웹 앱, API 서버, DB | O (제한적) |
| **Railway** | 풀스택 앱, DB | O (월 $5 크레딧) |
| **Fly.io** | Docker 컨테이너 기반 앱 | O (제한적) |
| **Supabase** | PostgreSQL DB + Auth | O (2개 프로젝트) |
| **Neon** | 서버리스 PostgreSQL | O (제한적) |

**장점:** 설정이 간단, 인프라 관리 불필요, 빠른 배포
**단점:** 세밀한 제어 어려움, 비용 증가 가능, 벤더 종속

### 2.2 IaaS (Infrastructure as a Service) — 클라우드 인프라 이용

가상 서버(VM)를 직접 빌려서 **운영체제부터 애플리케이션까지 직접 설치하고 관리**하는 방식입니다.

| 서비스 | 가상 서버 | 무료 티어 |
|--------|-----------|-----------|
| **AWS EC2** | Amazon 가상 서버 | O (12개월, t2.micro) |
| **Google Cloud (GCE)** | Google 가상 서버 | O (e2-micro 상시 무료) |
| **Azure VM** | Microsoft 가상 서버 | O (12개월) |

**장점:** 완전한 제어권, 유연한 구성, 비용 최적화 가능
**단점:** 설정 복잡, 인프라 관리 필요, 보안 직접 책임

### 2.3 비교 요약

```
     간편함 ◀──────────────────────────────▶ 제어력

     Vercel/Render          Railway/Fly.io          AWS EC2
     ┌───────────┐          ┌───────────┐          ┌───────────┐
     │ PaaS      │          │ CaaS/PaaS │          │ IaaS      │
     │ 코드만    │          │ Docker +  │          │ 서버 통째로│
     │ Push하면  │          │ 설정 파일  │          │ 빌려서     │
     │ 자동 배포 │          │ 올리면 배포│          │ 직접 관리  │
     └───────────┘          └───────────┘          └───────────┘
```

---

## 3. TaskFlow는 왜 Vercel만으로 배포할 수 없는가?

### 3.1 Vercel의 특성

Vercel은 **프론트엔드(Next.js)에 최적화된 플랫폼**입니다:

- Next.js 앱을 Git Push만으로 자동 빌드 & 배포
- 서버리스 함수(Serverless Functions)로 간단한 API 처리 가능
- 전 세계 CDN으로 정적 파일 빠르게 서빙

### 3.2 Vercel이 지원하지 않는 것

하지만 Vercel에는 다음과 같은 **제약**이 있습니다:

| 필요한 것 | Vercel 지원 여부 | 이유 |
|-----------|:---:|------|
| Next.js 프론트엔드 | ✅ | Vercel의 핵심 기능 |
| FastAPI 백엔드 | ❌ | Python 장기 실행 서버 불가 (서버리스 함수 10초 제한) |
| PostgreSQL DB | ❌ | 데이터베이스 호스팅 서비스 아님 |
| Docker Compose | ❌ | 컨테이너 오케스트레이션 미지원 |
| WebSocket 연결 | ❌ | 서버리스 특성상 장기 연결 불가 |

### 3.3 결론: 서비스 조합이 필요하다

TaskFlow처럼 **프론트엔드 + 백엔드 + DB**로 구성된 풀스택 앱은 단일 PaaS만으로는 한계가 있습니다. 따라서 두 가지 전략이 필요합니다:

```
전략 A: 서비스 조합                    전략 B: 올인원 서버
┌─────────────────────────┐           ┌─────────────────────────┐
│ Vercel ← 프론트엔드     │           │ AWS EC2 한 대           │
│ Render ← 백엔드(FastAPI)│           │  ├── Docker Compose     │
│ Neon   ← DB(PostgreSQL) │           │  │   ├── Frontend       │
│                         │           │  │   ├── Backend        │
│ 각각 다른 서비스에 배포  │           │  │   ├── DB             │
│ 서비스끼리 URL로 연결    │           │  │   └── Nginx          │
└─────────────────────────┘           │  로컬과 동일한 구조!    │
                                      └─────────────────────────┘
```

다음 섹션에서 이 두 가지 전략을 각각 실습합니다.

---

## 3.5. Vercel을 최대한 활용하는 기술 스택

### 3.5.1 Vercel의 강점과 특화 기능

Vercel은 단순한 호스팅 서비스가 아니라, **Next.js 생태계에 최적화된 통합 개발 플랫폼**입니다. Vercel을 최대한 활용하려면 Vercel의 강점을 이해하고, 그에 맞는 기술 스택을 선택해야 합니다.

**Vercel의 핵심 기능들:**

| 기능 | 설명 | 활용 사례 |
|------|------|-----------|
| **Edge Network** | 전 세계 CDN으로 정적 파일 초고속 서빙 | 프론트엔드 정적 리소스 |
| **Serverless Functions** | API 엔드포인트를 서버리스로 실행 (10초 제한) | 간단한 API, 인증, Webhook |
| **Edge Functions** | CDN 엣지에서 실행되는 초경량 함수 (밀리초 단위) | 리다이렉트, A/B 테스트, 지역화 |
| **Edge Middleware** | 요청 전처리 (인증, 로깅 등) | JWT 검증, 권한 체크 |
| **Image Optimization** | 자동 이미지 최적화 및 WebP 변환 | 이미지가 많은 서비스 |
| **Analytics** | 실시간 트래픽 분석 및 성능 모니터링 | 사용자 행동 분석 |
| **Preview Deployments** | PR마다 자동으로 미리보기 환경 생성 | 코드 리뷰, QA |
| **Vercel Postgres** | Vercel과 통합된 서버리스 PostgreSQL | 간단한 DB 연동 |

### 3.5.2 Vercel 친화적 기술 스택 조합

Vercel을 최대한 활용하려면, **서버리스 아키텍처에 적합한 기술 스택**을 선택해야 합니다.

#### 옵션 1: 풀스택 Next.js (권장)

```
┌─────────────────────────────────────────────┐
│              Vercel 배포                    │
├─────────────────────────────────────────────┤
│  Next.js App Router                         │
│    ├── /app (페이지)                        │
│    ├── /app/api (API Routes)  ← 백엔드 대체│
│    └── Server Components                    │
├─────────────────────────────────────────────┤
│  데이터베이스 선택지                         │
│    • Vercel Postgres (통합)                 │
│    • Neon (서버리스 PostgreSQL)             │
│    • Supabase (PostgreSQL + Auth + Storage) │
│    • PlanetScale (서버리스 MySQL)           │
│    • MongoDB Atlas (서버리스 NoSQL)         │
└─────────────────────────────────────────────┘
```

**장점:**
- Vercel의 모든 기능을 100% 활용 가능
- 프론트엔드와 백엔드가 하나의 저장소에 통합
- API Routes는 자동으로 서버리스 함수로 변환
- TypeScript로 프론트엔드와 백엔드 코드 공유
- Edge Runtime 사용 시 전 세계 어디서나 빠른 응답

**적합한 프로젝트:**
- API가 단순하고 CRUD 중심
- 장시간 실행이 필요 없음 (10초 제한)
- Python 같은 특정 언어가 필수가 아님
- 빠른 MVP 개발

**기술 스택:**
```typescript
// 프론트엔드
Next.js 14+ (App Router)
React 18+
TypeScript
Tailwind CSS

// 백엔드 (API Routes)
Next.js API Routes
Prisma ORM (DB 접근)
NextAuth.js (인증)
Zod (유효성 검증)

// 데이터베이스
Vercel Postgres (또는 Neon, Supabase)

// 추가 서비스
Vercel Blob (파일 스토리지)
Vercel KV (Redis 대체)
Vercel Cron (스케줄링)
```

**코드 예시:**

```typescript
// app/api/tasks/route.ts — Next.js API Route 예시
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const tasks = await prisma.task.findMany({
    where: { is_deleted: false },
    orderBy: { created_at: 'desc' }
  });

  return NextResponse.json({
    status: 'success',
    data: tasks
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const task = await prisma.task.create({
    data: {
      title: body.title,
      description: body.description,
      project_id: body.project_id
    }
  });

  return NextResponse.json({
    status: 'success',
    data: task
  }, { status: 201 });
}
```

#### 옵션 2: Next.js + tRPC (타입 안전성 강화)

tRPC는 TypeScript로 프론트엔드와 백엔드 간 타입을 자동으로 공유하는 프레임워크입니다.

```
Next.js Frontend  ←─── 타입 자동 동기화 ───→  tRPC Backend (API Routes)
                       (빌드 타임)
```

**장점:**
- REST API 없이 타입 안전한 함수 호출
- Swagger 문서 불필요 (타입이 문서 역할)
- 프론트엔드에서 자동완성과 타입 체크

**기술 스택:**
```typescript
// 추가 라이브러리
@trpc/server
@trpc/client
@trpc/next
@tanstack/react-query (데이터 페칭)

// 나머지는 옵션 1과 동일
```

#### 옵션 3: Next.js + Prisma + Supabase (풀스택 + 인증)

Supabase는 Firebase 대안으로, PostgreSQL + Auth + Storage + Realtime을 제공합니다.

**장점:**
- 인증 기능을 직접 구현할 필요 없음 (소셜 로그인, 이메일 인증 등)
- Row Level Security (RLS)로 DB 수준 권한 제어
- Realtime 기능 (WebSocket 대체)
- 파일 스토리지 포함

**기술 스택:**
```typescript
// 프론트엔드
Next.js 14+
TypeScript
Tailwind CSS

// 백엔드
Next.js API Routes
Supabase Client (DB + Auth)

// 데이터베이스 & 인증
Supabase (PostgreSQL + Auth + Storage)
```

### 3.5.3 현재 TaskFlow 프로젝트를 Vercel 친화적으로 전환하려면?

현재 TaskFlow는 `Next.js (프론트엔드) + FastAPI (백엔드)` 구조입니다. Vercel을 최대한 활용하려면 다음과 같은 마이그레이션을 고려할 수 있습니다:

**전환 시나리오:**

```
현재 구조:
frontend/  (Next.js)
backend/   (FastAPI)  ← Python 전용 서버

↓ 마이그레이션

새로운 구조:
app/           (Next.js App Router)
  ├── (routes) (페이지)
  ├── api/     (API Routes — FastAPI를 TypeScript로 재작성)
  └── lib/     (DB, Auth, 유틸리티)
```

**마이그레이션 단계:**

1. **API 엔드포인트를 Next.js API Routes로 포팅**
   - FastAPI의 각 라우터를 `app/api/[endpoint]/route.ts`로 변환
   - Pydantic 모델을 Zod 스키마로 변환
   - SQLAlchemy를 Prisma ORM으로 대체

2. **데이터베이스 연결 변경**
   - Vercel Postgres 또는 Neon으로 DB 마이그레이션
   - Prisma를 사용하여 타입 안전한 쿼리 작성

3. **인증 로직 이전**
   - JWT 로직을 NextAuth.js 또는 Supabase Auth로 교체
   - Edge Middleware로 보호된 라우트 구성

**예상 작업량:**
- API 엔드포인트가 20개 미만: 1-2일
- API 엔드포인트가 20-50개: 3-5일
- 복잡한 비즈니스 로직 포함: 1주일+

**마이그레이션이 어려운 경우:**

만약 다음 조건에 해당한다면, FastAPI를 유지하고 방법 A (Vercel + Render) 조합을 사용하는 것이 현실적입니다:

- Python 전용 라이브러리에 의존 (NumPy, Pandas, Scikit-learn 등)
- 머신러닝 모델 추론이 필요
- 장시간 실행 작업 필요 (비디오 인코딩, 데이터 처리 등)
- 팀 전체가 Python에 익숙하고 TypeScript 전환이 어려움

### 3.5.4 결론: 언제 Vercel 풀스택을 선택할 것인가?

```
✅ Vercel 풀스택 (Next.js + API Routes)을 선택하세요:
  □ API가 단순한 CRUD 중심
  □ 서버리스 10초 제한이 문제 없음
  □ TypeScript로 통합 개발 가능
  □ 빠른 배포와 무료 티어 활용
  □ Vercel의 Edge 기능 활용

❌ Vercel + 외부 백엔드를 선택하세요:
  □ Python 전용 라이브러리 필수
  □ 장시간 실행 작업 필요
  □ 복잡한 백엔드 로직
  □ 기존 FastAPI 코드베이스가 큼
  □ 레거시 시스템과 통합 필요
```

**TaskFlow의 경우:** 현재는 FastAPI를 사용하므로 **방법 A (Vercel + Render 조합)** 이 적합합니다. 하지만 학습 목적이나 장기적으로 Vercel 생태계에 완전히 통합하고 싶다면, API를 Next.js로 포팅하는 것도 고려할 수 있습니다.

---

## 4. 방법 A — Vercel + 외부 서비스 조합 배포

### 아키텍처 개요

```
  사용자 브라우저
       │
       ▼
  ┌──────────┐      API 요청       ┌──────────────┐       DB 연결       ┌────────────┐
  │  Vercel   │ ──────────────────▶ │   Render     │ ──────────────────▶ │    Neon    │
  │ (Next.js) │ ◀────────────────── │  (FastAPI)   │ ◀────────────────── │(PostgreSQL)│
  │ 프론트엔드│      JSON 응답      │   백엔드      │      쿼리 결과     │     DB     │
  └──────────┘                      └──────────────┘                     └────────────┘
```

### Step 1: 데이터베이스 준비 (Neon PostgreSQL)

> Neon은 서버리스 PostgreSQL 서비스로, 무료 플랜에서도 충분히 사용할 수 있습니다.

**1-1. 가입 및 프로젝트 생성**

1. [neon.tech](https://neon.tech) 에 접속하여 GitHub 계정으로 가입합니다.
2. **"New Project"** 를 클릭합니다.
3. 프로젝트 이름: `taskflow`
4. Region: `Asia Pacific (Singapore)` 선택 (한국에서 가장 가까움)
5. **"Create Project"** 를 클릭합니다.

**1-2. 연결 정보 확인**

프로젝트 생성 후 대시보드에서 연결 문자열을 확인합니다:

```
postgresql://taskflow_owner:AbCdEf123456@ep-xxx-yyy-12345.ap-southeast-1.aws.neon.tech/taskflow?sslmode=require
```

> **중요:** 이 URL을 안전하게 저장합니다. 백엔드 환경 변수에 사용됩니다.
>
> **참고:** FastAPI에서 asyncpg를 사용하므로, 프로토콜을 `postgresql+asyncpg://`로 변경해야 합니다.

```bash
# .env에서 사용할 DATABASE_URL 형식 (asyncpg 드라이버 사용)
DATABASE_URL=postgresql+asyncpg://taskflow_owner:AbCdEf123456@ep-xxx-yyy-12345.ap-southeast-1.aws.neon.tech/taskflow?sslmode=require
```

### Step 2: 백엔드 배포 (Render)

> Render는 Docker 기반 배포를 지원하는 PaaS로, FastAPI 같은 Python 서버를 쉽게 배포할 수 있습니다.

**2-1. 가입 및 서비스 생성**

1. [render.com](https://render.com) 에 접속하여 GitHub 계정으로 가입합니다.
2. 대시보드에서 **"New +" → "Web Service"** 를 클릭합니다.
3. GitHub 저장소를 연결하고, TaskFlow 저장소를 선택합니다.

**2-2. 서비스 설정**

| 항목 | 값 |
|------|-----|
| Name | `taskflow-backend` |
| Region | `Singapore` |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | `Docker` |
| Instance Type | `Free` |

**2-3. 환경 변수 설정**

Render 대시보드의 **"Environment"** 탭에서 다음 환경 변수를 추가합니다:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql+asyncpg://...(Neon에서 복사한 URL)` |
| `JWT_SECRET` | `(운영용으로 새로 생성한 강력한 시크릿)` |
| `JWT_ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
| `FRONTEND_URL` | `https://taskflow-frontend.vercel.app` (Step 3 이후 업데이트) |

> **팁:** JWT_SECRET은 터미널에서 다음 명령어로 안전하게 생성할 수 있습니다.
> ```bash
> openssl rand -hex 32
> ```

**2-4. 프로덕션용 Dockerfile 수정**

배포 시에는 `--reload` 옵션을 제거해야 합니다. Render에서 Docker를 사용하므로, 프로덕션용 CMD를 설정합니다.

```dockerfile
# backend/Dockerfile — 프로덕션에서는 --reload 제거
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

> **참고:** 개발 환경에서는 `--reload`로 코드 변경 감지가 유용하지만, 운영 환경에서는 불필요하고 성능에 영향을 줍니다.

**2-5. 배포 및 확인**

1. 설정 완료 후 **"Create Web Service"** 를 클릭합니다.
2. Render가 자동으로 Docker 이미지를 빌드하고 배포합니다.
3. 배포가 완료되면 `https://taskflow-backend.onrender.com` 같은 URL이 발급됩니다.
4. 브라우저에서 `https://taskflow-backend.onrender.com/docs` 에 접속하여 API 문서가 뜨는지 확인합니다.

### Step 3: 프론트엔드 배포 (Vercel)

**3-1. 가입 및 프로젝트 연결**

1. [vercel.com](https://vercel.com) 에 접속하여 GitHub 계정으로 가입합니다.
2. **"Add New..." → "Project"** 를 클릭합니다.
3. GitHub에서 TaskFlow 저장소를 Import합니다.

**3-2. 프로젝트 설정**

| 항목 | 값 |
|------|-----|
| Project Name | `taskflow-frontend` |
| Framework Preset | `Next.js` (자동 감지) |
| Root Directory | `frontend` |

**3-3. 환경 변수 설정**

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://taskflow-backend.onrender.com/api/v1` |

> `NEXT_PUBLIC_` 접두사가 있어야 브라우저에서 접근할 수 있습니다.

**3-4. 배포**

1. **"Deploy"** 를 클릭합니다.
2. Vercel이 자동으로 `npm run build`를 실행하고 배포합니다.
3. 완료되면 `https://taskflow-frontend.vercel.app` 같은 URL이 발급됩니다.
4. 이 URL을 Render의 `FRONTEND_URL` 환경 변수에 업데이트합니다 (CORS 허용 목적).

### Step 4: 서비스 간 연결 확인

배포 후 다음을 반드시 확인합니다:

```
✅ 체크리스트:
  □ Neon DB에 테이블이 생성되었는가? (백엔드 시작 시 자동 마이그레이션 확인)
  □ Render 백엔드에서 /docs (Swagger UI)가 정상 로딩되는가?
  □ Vercel 프론트엔드에서 로그인/회원가입이 동작하는가?
  □ 프론트엔드 → 백엔드 API 호출 시 CORS 에러가 없는가?
  □ 브라우저 개발자 도구 Network 탭에서 API 요청 URL이 올바른가?
```

### 방법 A의 장단점

| 장점 | 단점 |
|------|------|
| 각 서비스가 독립적으로 스케일링 | 3개 서비스를 각각 관리해야 함 |
| Vercel의 CDN으로 빠른 프론트엔드 | 서비스 간 네트워크 지연 발생 |
| 무료 티어로 비용 절감 | 무료 티어 제약 (Render: 15분 슬립) |
| Git Push로 자동 배포 (CI/CD 내장) | 환경 변수 관리가 분산됨 |

---

## 5. 방법 B — AWS EC2 + Docker 올인원 배포

### 아키텍처 개요

```
                          AWS EC2 인스턴스 (Ubuntu)
  사용자              ┌──────────────────────────────────────────┐
  브라우저            │                                          │
     │               │   Docker Compose                         │
     │   :80/:443    │   ┌────────────────────────────────────┐ │
     ├──────────────▶│   │  Nginx (리버스 프록시)              │ │
     │               │   │   ├── / → Frontend (3000)          │ │
     │               │   │   └── /api → Backend (8000)        │ │
     │               │   ├────────────────────────────────────┤ │
     │               │   │  Frontend  │ Backend  │     DB     │ │
     │               │   │  (Next.js) │(FastAPI) │(PostgreSQL)│ │
     │               │   │   :3000    │  :8000   │   :5432    │ │
     │               │   └────────────────────────────────────┘ │
     │               │                                          │
     │               └──────────────────────────────────────────┘
```

로컬 개발 환경의 `docker-compose.yml`을 거의 그대로 사용하되, **Nginx를 추가하고 운영 환경에 맞게 설정을 조정**합니다.

### Step 1: AWS 계정 준비 및 EC2 인스턴스 생성

**1-1. AWS 계정 가입**

1. [aws.amazon.com](https://aws.amazon.com) 에서 계정을 생성합니다.
2. 프리 티어(무료)를 활용하면 12개월간 t2.micro 인스턴스를 무료로 사용할 수 있습니다.

**1-2. EC2 인스턴스 생성**

1. AWS 콘솔 → **EC2** → **"인스턴스 시작"** 을 클릭합니다.

2. 다음과 같이 설정합니다:

| 항목 | 값 |
|------|-----|
| 이름 | `taskflow-server` |
| OS 이미지 (AMI) | `Ubuntu Server 24.04 LTS` |
| 인스턴스 유형 | `t2.small` (프리 티어: t2.micro도 가능하나 메모리 부족 우려) |
| 키 페어 | 새로 생성 → `taskflow-key` (.pem 파일 다운로드) |
| 네트워크 설정 | 아래 보안 그룹 규칙 참조 |
| 스토리지 | `20 GiB gp3` |

3. **보안 그룹(Security Group)** 인바운드 규칙:

| 타입 | 포트 | 소스 | 용도 |
|------|------|------|------|
| SSH | 22 | 내 IP | 서버 접속용 |
| HTTP | 80 | 0.0.0.0/0 | 웹 서비스 (Nginx) |
| HTTPS | 443 | 0.0.0.0/0 | 웹 서비스 (SSL) |

> **주의:** 포트 3000, 8000, 5432는 **외부에 열지 않습니다**. Nginx가 80번 포트에서 내부로 라우팅합니다.

4. **"인스턴스 시작"** 을 클릭합니다.

**1-3. 탄력적 IP(Elastic IP) 할당**

EC2 인스턴스는 재시작 시 IP가 바뀔 수 있으므로, 고정 IP를 할당합니다:

1. EC2 → **탄력적 IP** → **"탄력적 IP 주소 할당"**
2. 할당된 IP를 인스턴스에 연결합니다.

```
할당된 IP 예시: 13.125.xxx.xxx  ← 이후 이 IP로 접속합니다.
```

### Step 2: 서버 접속 및 초기 설정

**2-1. SSH로 서버 접속**

```bash
# 키 파일 권한 설정 (최초 1회)
chmod 400 taskflow-key.pem

# SSH 접속
ssh -i taskflow-key.pem ubuntu@13.125.xxx.xxx
```

**2-2. 시스템 업데이트 및 Docker 설치**

```bash
# 시스템 패키지 업데이트
sudo apt update && sudo apt upgrade -y

# Docker 설치에 필요한 패키지
sudo apt install -y ca-certificates curl gnupg

# Docker 공식 GPG 키 추가
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Docker 저장소 추가
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 설치
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 현재 사용자를 docker 그룹에 추가 (sudo 없이 docker 사용)
sudo usermod -aG docker $USER

# 변경 사항 적용 (재접속)
exit
```

재접속 후 Docker가 정상 설치되었는지 확인합니다:

```bash
ssh -i taskflow-key.pem ubuntu@13.125.xxx.xxx

docker --version
# Docker version 27.x.x

docker compose version
# Docker Compose version v2.x.x
```

### Step 3: 프로젝트 배포

**3-1. 프로젝트 코드 가져오기**

```bash
# Git 설치 (보통 Ubuntu에 기본 포함)
sudo apt install -y git

# 프로젝트 클론
cd ~
git clone https://github.com/<your-username>/fc-ica-doc-first-dev.git
cd fc-ica-doc-first-dev
```

**3-2. 운영용 환경 변수 파일 생성**

```bash
# .env 파일 생성
cat > .env << 'EOF'
# PostgreSQL
POSTGRES_USER=taskflow
POSTGRES_PASSWORD=<강력한_비밀번호_생성>
POSTGRES_DB=taskflow

# Backend DB 접속 (docker 내부에서는 호스트명이 db)
DATABASE_URL=postgresql+asyncpg://taskflow:<위와_같은_비밀번호>@db:5432/taskflow

# JWT 설정
JWT_SECRET=<openssl rand -hex 32 로 생성한 값>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 서비스 URL (EC2 퍼블릭 IP 사용)
FRONTEND_URL=http://13.125.xxx.xxx
BACKEND_URL=http://13.125.xxx.xxx/api/v1
EOF
```

> **보안 주의:** 운영 환경에서는 반드시 강력한 비밀번호와 시크릿을 사용합니다.

**3-3. 프로덕션용 docker-compose 파일 생성**

로컬 개발용 `docker-compose.yml`을 기반으로, 운영 환경에 맞게 수정한 파일을 생성합니다:

```bash
cat > docker-compose.prod.yml << 'YAML'
version: "3.8"

services:
  # ============================================
  # PostgreSQL 데이터베이스
  # ============================================
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    # 포트를 외부에 노출하지 않음 (보안)

  # ============================================
  # FastAPI 백엔드
  # ============================================
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      JWT_ALGORITHM: ${JWT_ALGORITHM}
      ACCESS_TOKEN_EXPIRE_MINUTES: ${ACCESS_TOKEN_EXPIRE_MINUTES}
      FRONTEND_URL: ${FRONTEND_URL}
    depends_on:
      - db
    # 포트를 외부에 노출하지 않음 (Nginx가 프록시)

  # ============================================
  # Next.js 프론트엔드
  # ============================================
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: ${BACKEND_URL}
    depends_on:
      - backend
    # 포트를 외부에 노출하지 않음 (Nginx가 프록시)

  # ============================================
  # Nginx 리버스 프록시
  # ============================================
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
YAML
```

**핵심 차이점 (개발용 vs 운영용):**

| 항목 | docker-compose.yml (개발) | docker-compose.prod.yml (운영) |
|------|---------------------------|-------------------------------|
| DB 포트 | `5432:5432` 외부 노출 | 외부 노출 안 함 |
| Backend 포트 | `8000:8000` 외부 노출 | 외부 노출 안 함 |
| Frontend 포트 | `3000:3000` 외부 노출 | 외부 노출 안 함 |
| Nginx | 없음 | 80번 포트로 통합 진입 |
| Frontend 빌드 | `npm run dev` (개발 서버) | `npm run build && npm start` (프로덕션) |
| Backend 실행 | `--reload` 옵션 포함 | `--reload` 제거 |

**3-4. 프론트엔드 프로덕션용 Dockerfile 생성**

개발용 Dockerfile은 `npm run dev`를 실행하지만, 프로덕션에서는 빌드 후 `npm start`를 실행해야 합니다:

```bash
cat > frontend/Dockerfile.prod << 'DOCKERFILE'
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# 빌드 시 환경 변수 주입 (NEXT_PUBLIC_ 변수는 빌드 타임에 필요)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# --- 실행 스테이지 ---
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
DOCKERFILE
```

> **multi-stage 빌드:** 빌더 스테이지에서 빌드하고, 실행 스테이지에서는 빌드 결과물만 복사하여 이미지 크기를 줄입니다.

**3-5. 백엔드 프로덕션 CMD 조정**

운영 환경에서는 `--reload`를 제거해야 합니다. 별도 Dockerfile.prod를 만들거나, 기존 Dockerfile에서 CMD를 오버라이드합니다.

`docker-compose.prod.yml`의 backend 서비스에 다음을 추가합니다:

```yaml
  backend:
    # ... (기존 설정)
    command: ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Step 4: Nginx 설정

**4-1. Nginx 설정 파일 생성**

```bash
# Nginx 설정 디렉토리 생성
mkdir -p nginx

# 설정 파일 작성
cat > nginx/default.conf << 'NGINX'
upstream frontend {
    server frontend:3000;
}

upstream backend {
    server backend:8000;
}

server {
    listen 80;
    server_name _;

    # ──────────────────────────────────
    # API 요청 → FastAPI 백엔드로 프록시
    # ──────────────────────────────────
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ──────────────────────────────────
    # API 문서 (Swagger UI)
    # ──────────────────────────────────
    location /docs {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /openapi.json {
        proxy_pass http://backend;
        proxy_set_header Host $host;
    }

    # ──────────────────────────────────
    # 그 외 모든 요청 → Next.js 프론트엔드로 프록시
    # ──────────────────────────────────
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Next.js 핫 리로드용 WebSocket (개발 시에만 필요, 운영에서는 무해)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINX
```

### Step 5: 빌드 및 실행

```bash
# 프로덕션 구성으로 빌드 및 실행
docker compose -f docker-compose.prod.yml up -d --build

# 컨테이너 상태 확인
docker compose -f docker-compose.prod.yml ps

# 로그 확인
docker compose -f docker-compose.prod.yml logs -f
```

정상 실행되면 다음과 같은 출력이 나옵니다:

```
NAME                  STATUS              PORTS
taskflow-db-1         running             5432/tcp
taskflow-backend-1    running             8000/tcp
taskflow-frontend-1   running             3000/tcp
taskflow-nginx-1      running             0.0.0.0:80->80/tcp
```

### Step 6: 접속 확인

```bash
# 서버 내부에서 확인
curl http://localhost        # 프론트엔드 페이지
curl http://localhost/api/v1/health   # 백엔드 헬스 체크 (엔드포인트가 있는 경우)
```

브라우저에서 EC2의 퍼블릭 IP로 접속합니다:

```
http://13.125.xxx.xxx        ← 프론트엔드 화면
http://13.125.xxx.xxx/docs   ← API 문서 (Swagger UI)
```

### Step 7: 유용한 운영 명령어

```bash
# 서비스 중지
docker compose -f docker-compose.prod.yml down

# 코드 업데이트 후 재배포
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build

# 특정 서비스만 재시작
docker compose -f docker-compose.prod.yml restart backend

# 로그 확인 (최근 100줄)
docker compose -f docker-compose.prod.yml logs --tail 100 backend

# 디스크 정리 (미사용 이미지 삭제)
docker system prune -f
```

---

## 6. Nginx의 역할과 도입

### 6.1 Next.js에 Nginx가 필요한 이유

"Next.js는 `npm start`로 자체 서버를 실행하는데, 왜 Nginx가 필요할까?"

이는 매우 좋은 질문이며, 다음과 같은 이유가 있습니다:

#### 이유 1: 단일 진입점(Single Entry Point) 통합

Nginx 없이 배포하면 사용자는 서비스마다 다른 포트로 접속해야 합니다:

```
❌ Nginx 없이:
  프론트엔드: http://13.125.xxx.xxx:3000
  백엔드 API: http://13.125.xxx.xxx:8000/api/v1
  → 포트 3000, 8000을 모두 보안 그룹에서 열어야 함
  → 사용자가 포트 번호를 알아야 함
  → CORS 문제 발생 (도메인은 같지만 포트가 다르면 다른 origin)

✅ Nginx 사용:
  모든 요청:  http://13.125.xxx.xxx (포트 80)
    /          → 프론트엔드로 전달
    /api/      → 백엔드로 전달
  → 포트 80 하나만 열면 됨
  → 사용자는 포트 번호를 몰라도 됨
  → 같은 도메인+포트이므로 CORS 문제 없음
```

#### 이유 2: 보안

```
┌─ 외부(인터넷) ─┐     ┌─ 내부(Docker 네트워크) ─┐
│                 │     │                          │
│  사용자 ──:80──▶│ Nginx │──▶ Frontend (:3000)    │
│                 │     │  ──▶ Backend  (:8000)    │
│                 │     │      DB       (:5432)    │
│                 │     │                          │
│  포트 80만 열림 │     │ 나머지 포트는 외부 차단  │
└─────────────────┘     └──────────────────────────┘
```

- DB 포트(5432)가 외부에 노출되지 않아 직접 접속 불가
- 내부 서비스 구조가 외부에 숨겨짐

#### 이유 3: 정적 파일 서빙 성능

Next.js의 내장 서버도 정적 파일을 서빙할 수 있지만, Nginx는 정적 파일 서빙에 특화되어 있습니다:

| 항목 | Next.js 내장 서버 | Nginx |
|------|-------------------|-------|
| 정적 파일 서빙 | Node.js 싱글 스레드 | C로 작성된 고성능 서버 |
| 동시 접속 처리 | 수백 ~ 수천 | 수만 동시 접속 |
| gzip 압축 | 지원 (설정 필요) | 기본 지원, 고성능 |
| 캐싱 | 제한적 | 세밀한 캐시 제어 가능 |
| SSL/TLS (HTTPS) | 별도 설정 복잡 | 간단한 설정 |

#### 이유 4: HTTPS 적용의 편의성

실제 서비스에서는 HTTPS가 필수입니다. Nginx에서 SSL 인증서를 한 곳에서 관리할 수 있습니다:

```
  사용자  ──HTTPS(:443)──▶  Nginx  ──HTTP──▶  Frontend/Backend
                            (SSL 종료)        (내부는 HTTP로 통신)
```

### 6.2 Nginx를 도입하는 과정 요약

이 프로젝트에서 Nginx를 도입한 과정을 정리하면:

```
1. docker-compose.prod.yml에 nginx 서비스 추가
2. nginx/default.conf 설정 파일 작성
   - / 경로 → frontend 컨테이너로 프록시
   - /api/ 경로 → backend 컨테이너로 프록시
3. frontend, backend의 포트를 외부에 노출하지 않도록 변경
4. nginx만 80번 포트를 외부에 노출
```

이것이 **리버스 프록시(Reverse Proxy)** 패턴이며, 실무에서 가장 널리 사용되는 배포 구조입니다.

---

## 7. 정리 및 비교

### 7.1 두 가지 배포 방법 비교

| 비교 항목 | 방법 A (Vercel + Render + Neon) | 방법 B (AWS EC2 + Docker) |
|-----------|:---:|:---:|
| **설정 난이도** | 쉬움 | 보통 ~ 어려움 |
| **비용 (초기)** | 무료 (프리 티어 조합) | 무료 (AWS 프리 티어) |
| **비용 (성장 시)** | 서비스별 과금 누적 | 인스턴스 크기에 비례 |
| **제어 수준** | 제한적 | 완전한 제어 |
| **스케일링** | 서비스별 자동 스케일링 | 수동 (또는 Auto Scaling 설정) |
| **운영 부담** | 낮음 (플랫폼이 관리) | 높음 (직접 관리) |
| **CI/CD** | Git Push로 자동 배포 | 수동 (또는 별도 구성) |
| **SSL/HTTPS** | 자동 (무료) | 직접 설정 (Let's Encrypt) |
| **커스텀 도메인** | 간단 (각 서비스 설정) | DNS + Nginx 설정 |
| **학습 가치** | PaaS 활용법 | 인프라 + 배포 전반 이해 |
| **추천 상황** | 빠른 MVP, 사이드 프로젝트 | 실무 배포 학습, 비용 최적화 |

### 7.2 실무에서의 선택 기준

```
"우리 팀은 어떤 방식을 선택해야 할까?"

  빠르게 출시해야 한다      →  방법 A (PaaS 조합)
  비용을 최소화해야 한다    →  방법 B (EC2)
  인프라를 배워야 한다      →  방법 B (EC2)
  서버 관리 인력이 없다     →  방법 A (PaaS 조합)
  트래픽이 예측 불가능하다  →  방법 A (PaaS 조합)
  특수한 설정이 필요하다    →  방법 B (EC2)
```

### 7.3 다음 단계 (이 강의 이후 학습할 주제)

배포를 완료했다면, 실제 서비스 운영을 위해 추가로 학습하면 좋은 주제들입니다:

1. **HTTPS 적용** — Let's Encrypt + Certbot으로 무료 SSL 인증서 설정
2. **도메인 연결** — 커스텀 도메인 구매 및 DNS 설정
3. **CI/CD 파이프라인** — GitHub Actions로 자동 배포 구성
4. **모니터링** — 서버 상태, 에러, 성능 모니터링 도구 도입
5. **백업** — 데이터베이스 정기 백업 설정
6. **로드 밸런싱** — 트래픽 증가 시 여러 서버로 분산

---

## 8. AI Agent를 활용한 배포 워크플로우

### 8.1 개요

배포 작업을 Cursor나 Claude Code 같은 AI 코딩 도구와 함께 진행하면 효율성을 크게 높일 수 있습니다. AI Agent는 설정 파일 생성, 스크립트 작성 등의 반복적인 작업을 자동화할 수 있지만, 실제 인프라 생성이나 원격 서버 제어는 직접 해야 합니다.

### 8.2 AI Agent가 도울 수 있는 부분 vs 수동 작업

| 작업 유형 | AI Agent | 수동 작업 | 비율 |
|-----------|:--------:|:---------:|:----:|
| **설정 파일 생성** (docker-compose.prod.yml, Dockerfile.prod, nginx.conf) | ✅ | | 100% |
| **환경 변수 템플릿 작성** (.env 파일) | ✅ | | 100% |
| **배포 스크립트 작성** (deploy.sh) | ✅ | | 100% |
| **AWS 인프라 생성** (EC2 인스턴스, 보안 그룹) | | ✅ | 100% |
| **원격 서버 접속 및 명령 실행** (SSH) | | ✅ | 100% |
| **전체 작업 비율** | 40-50% | 50-60% | - |

### 8.3 추천 워크플로우 (방법 B: AWS EC2 배포)

다음은 AI Agent와 수동 작업을 효과적으로 조합한 배포 워크플로우입니다:

```
┌─────────────────────────────────────────────────────────────────┐
│  Phase 1: 로컬 설정 파일 준비 (AI Agent)          ⏱️  10분     │
├─────────────────────────────────────────────────────────────────┤
│  ✅ AI에게 프롬프트 입력                                         │
│     → docker-compose.prod.yml 생성                               │
│     → frontend/Dockerfile.prod 생성                              │
│     → backend/Dockerfile 수정 (프로덕션 모드)                    │
│     → nginx/default.conf 생성                                    │
│     → .env.production.example 생성                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Phase 2: AWS 인프라 생성 (수동)                  ⏱️  10분     │
├─────────────────────────────────────────────────────────────────┤
│  ✋ AWS 콘솔에서 직접 작업                                       │
│     → EC2 인스턴스 생성 (Ubuntu 24.04, t2.small)                │
│     → 보안 그룹 설정 (SSH:22, HTTP:80, HTTPS:443)               │
│     → 탄력적 IP 할당                                              │
│     → 키 페어(.pem) 다운로드                                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Phase 3: 배포 스크립트 준비 (AI Agent)           ⏱️  5분      │
├─────────────────────────────────────────────────────────────────┤
│  ✅ AI에게 프롬프트 입력                                         │
│     → scripts/setup-server.sh 생성 (서버 초기 설정)             │
│     → scripts/deploy.sh 생성 (코드 배포)                        │
│     → scripts/update.sh 생성 (코드 업데이트)                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Phase 4: 서버 초기 설정 (수동 + 스크립트)        ⏱️  10분     │
├─────────────────────────────────────────────────────────────────┤
│  ✋ SSH 접속 후 스크립트 실행                                    │
│     → ssh -i key.pem ubuntu@<EC2-IP>                             │
│     → git clone <repository>                                     │
│     → ./scripts/setup-server.sh (Docker 설치 등)                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Phase 5: 서비스 배포 (수동 + 스크립트)           ⏱️  5분      │
├─────────────────────────────────────────────────────────────────┤
│  ✋ 환경 변수 설정 후 배포 스크립트 실행                         │
│     → vi .env (운영 환경 변수 입력)                             │
│     → ./scripts/deploy.sh                                        │
│     → http://<EC2-IP> 접속 확인                                 │
└─────────────────────────────────────────────────────────────────┘
```

**총 소요 시간:** 약 40분 (AI 활용 시) vs 60분+ (전부 수동)

### 8.4 Phase별 상세 프롬프트

각 Phase에서 AI Agent에게 입력할 프롬프트는 `docs/prompts/all-prompts.md`의 **"배포 관련 프롬프트"** 섹션을 참조하세요.

### 8.5 워크플로우 활용 팁

1. **Phase 1에서 파일 검증하기**
   ```bash
   # 로컬에서 프로덕션 설정 테스트
   docker compose -f docker-compose.prod.yml config
   ```

2. **Phase 3의 스크립트에 에러 처리 추가**
   - 스크립트 실행 중 오류 발생 시 자동 중단 (`set -e`)
   - 각 단계마다 성공/실패 메시지 출력

3. **Phase 4는 최초 1회만 실행**
   - 서버 초기 설정은 한 번만 하면 됨
   - 이후 배포는 Phase 5만 반복

4. **재배포 시에는 업데이트 스크립트 사용**
   ```bash
   # 코드 변경 후 재배포
   git pull origin main
   ./scripts/update.sh
   ```

### 8.6 고급: Terraform으로 인프라 자동화 (선택 사항)

Phase 2의 수동 작업을 자동화하고 싶다면, AI Agent에게 Terraform 코드를 작성하게 할 수 있습니다:

```
"AWS EC2 인스턴스를 생성하는 Terraform 코드를 작성해줘.
요구사항:
- Ubuntu 24.04 AMI
- t2.small 인스턴스
- 보안 그룹: SSH(22), HTTP(80), HTTPS(443)
- 탄력적 IP 자동 할당
- 출력: 인스턴스 퍼블릭 IP"
```

이후 `terraform apply` 명령으로 인프라를 자동 생성할 수 있습니다. 다만, Terraform 학습 곡선이 있으므로 처음 배포하는 경우에는 수동 방식을 권장합니다.

### 8.7 AI Agent 활용 시 주의사항

1. **생성된 파일은 반드시 검토하기**
   - 보안 관련 설정 (포트, 비밀번호 등)
   - 환경 변수 경로가 올바른지 확인

2. **민감한 정보는 절대 커밋하지 않기**
   - `.env` 파일은 `.gitignore`에 추가
   - 예시 파일(`.env.example`)만 커밋

3. **스크립트 실행 권한 확인**
   ```bash
   chmod +x scripts/*.sh
   ```

4. **AI가 생성한 명령어를 맹목적으로 실행하지 않기**
   - 특히 `rm -rf`, `docker system prune -a` 같은 위험한 명령어
   - 실행 전 무엇을 하는 명령인지 이해하기

---

## 부록: 빠른 참조

### 자주 사용하는 명령어 모음

```bash
# ── EC2 서버 접속 ──
ssh -i taskflow-key.pem ubuntu@<EC2-IP>

# ── Docker Compose 운영 명령어 ──
docker compose -f docker-compose.prod.yml up -d --build   # 빌드 & 시작
docker compose -f docker-compose.prod.yml down             # 중지
docker compose -f docker-compose.prod.yml ps               # 상태 확인
docker compose -f docker-compose.prod.yml logs -f          # 로그 실시간 확인
docker compose -f docker-compose.prod.yml restart backend  # 특정 서비스 재시작

# ── 코드 업데이트 후 재배포 ──
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build

# ── 디스크 관리 ──
docker system prune -f          # 미사용 리소스 정리
df -h                           # 디스크 사용량 확인
```

### 환경 변수 체크리스트

| 변수명 | 개발 환경 | 운영 환경 |
|--------|-----------|-----------|
| `DATABASE_URL` | `...@db:5432/taskflow` | 동일 (Docker 내부) 또는 Neon URL |
| `JWT_SECRET` | 임의 값 | `openssl rand -hex 32` 결과 |
| `FRONTEND_URL` | `http://localhost:3000` | `http://<EC2-IP>` 또는 Vercel URL |
| `BACKEND_URL` | `http://localhost:8000/api/v1` | `http://<EC2-IP>/api/v1` 또는 Render URL |
| `POSTGRES_PASSWORD` | `taskflow1234` | 강력한 비밀번호로 변경 |

### 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| 프론트엔드 접속 안 됨 | 보안 그룹에서 80번 포트 미오픈 | EC2 보안 그룹 인바운드 규칙 확인 |
| API 호출 시 CORS 에러 | `FRONTEND_URL` 환경 변수 불일치 | 백엔드 환경 변수에 정확한 프론트엔드 URL 설정 |
| DB 연결 실패 | `DATABASE_URL`의 호스트명 오류 | Docker 내부에서는 `db`, 외부에서는 실제 호스트 사용 |
| 이미지 빌드 실패 | Docker 메모리 부족 (t2.micro) | `docker system prune`으로 정리, 또는 인스턴스 업그레이드 |
| 컨테이너가 계속 재시작 | 환경 변수 누락 또는 오류 | `docker compose logs <서비스명>`으로 에러 확인 |
