# API 설계 문서 (API Design)

## 프로젝트: TaskFlow — 태스크 관리 SaaS

> Backend: FastAPI (Python 3.12)
> Base URL: `/api/v1`
> 인증: JWT Bearer Token

---

## 1. 공통 규칙

### 1.1 Base URL

```
http://localhost:8000/api/v1
```

### 1.2 인증

JWT Bearer Token을 `Authorization` 헤더에 포함한다.

```
Authorization: Bearer <access_token>
```

- Access Token 만료 시간: 30분
- Refresh Token 만료 시간: 7일

### 1.3 응답 형식

#### 성공 응답

```json
{
  "status": "success",
  "data": { ... },
  "message": null
}
```

#### 목록 응답 (페이지네이션 포함)

```json
{
  "status": "success",
  "data": {
    "items": [ ... ],
    "total": 42,
    "page": 1,
    "size": 20
  },
  "message": null
}
```

#### 에러 응답

```json
{
  "status": "error",
  "data": null,
  "message": "에러 메시지",
  "errors": [
    {
      "field": "email",
      "message": "유효한 이메일 형식이 아닙니다"
    }
  ]
}
```

### 1.4 공통 HTTP 상태 코드

| 코드 | 의미 | 사용 상황 |
|------|------|-----------|
| 200 | OK | 조회, 수정 성공 |
| 201 | Created | 생성 성공 |
| 204 | No Content | 삭제 성공 |
| 400 | Bad Request | 잘못된 요청 데이터 |
| 401 | Unauthorized | 인증 실패 (토큰 없음/만료) |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스를 찾을 수 없음 |
| 409 | Conflict | 중복 리소스 (이메일 등) |
| 422 | Unprocessable Entity | 유효성 검증 실패 |
| 500 | Internal Server Error | 서버 내부 오류 |

### 1.5 공통 헤더

| 헤더 | 값 | 설명 |
|------|-----|------|
| `Content-Type` | `application/json` | 요청/응답 모두 JSON |
| `Authorization` | `Bearer <token>` | 인증이 필요한 엔드포인트 |

---

## 2. 인증 API (Auth)

### 2.1 회원가입

사용자 계정을 생성한다.

```
POST /api/v1/auth/register
```

**인증 필요:** 아니오

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "홍길동"
}
```

| 필드 | 타입 | 필수 | 유효성 검증 |
|------|------|------|-------------|
| `email` | string | Y | 이메일 형식, 최대 255자 |
| `password` | string | Y | 최소 8자, 최대 128자 |
| `name` | string | Y | 최소 1자, 최대 100자 |

**Response (201 Created):**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "홍길동",
      "created_at": "2025-01-15T09:00:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer"
  },
  "message": null
}
```

**Error Cases:**

| 상태 코드 | 조건 | 응답 메시지 |
|-----------|------|------------|
| 409 | 이미 가입된 이메일 | "이미 사용 중인 이메일입니다" |
| 422 | 비밀번호 8자 미만 | "비밀번호는 최소 8자 이상이어야 합니다" |
| 422 | 이메일 형식 오류 | "유효한 이메일 형식이 아닙니다" |

---

### 2.2 로그인

이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받는다.

```
POST /api/v1/auth/login
```

**인증 필요:** 아니오

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

| 필드 | 타입 | 필수 | 유효성 검증 |
|------|------|------|-------------|
| `email` | string | Y | 이메일 형식 |
| `password` | string | Y | 비어있지 않음 |

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "홍길동",
      "created_at": "2025-01-15T09:00:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer"
  },
  "message": null
}
```

**Error Cases:**

| 상태 코드 | 조건 | 응답 메시지 |
|-----------|------|------------|
| 401 | 이메일 또는 비밀번호 불일치 | "이메일 또는 비밀번호가 올바르지 않습니다" |

---

### 2.3 토큰 갱신

Refresh Token으로 새로운 Access Token을 발급받는다.

```
POST /api/v1/auth/refresh
```

**인증 필요:** 아니오 (Refresh Token을 Body로 전달)

**Request Body:**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer"
  },
  "message": null
}
```

**Error Cases:**

| 상태 코드 | 조건 | 응답 메시지 |
|-----------|------|------------|
| 401 | Refresh Token 만료 또는 무효 | "유효하지 않은 토큰입니다. 다시 로그인해주세요" |

---

## 3. 프로젝트 API (Projects)

### 3.1 프로젝트 생성

새 프로젝트를 생성한다. 생성자는 자동으로 소유자(owner)가 된다.

```
POST /api/v1/projects
```

**인증 필요:** 예

**Request Body:**

```json
{
  "name": "웹사이트 리뉴얼",
  "description": "회사 홈페이지 전면 리디자인 프로젝트"
}
```

| 필드 | 타입 | 필수 | 유효성 검증 |
|------|------|------|-------------|
| `name` | string | Y | 최소 1자, 최대 100자 |
| `description` | string | N | 최대 500자 |

**Response (201 Created):**

```json
{
  "status": "success",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "웹사이트 리뉴얼",
    "description": "회사 홈페이지 전면 리디자인 프로젝트",
    "owner_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2025-01-15T09:00:00Z",
    "updated_at": "2025-01-15T09:00:00Z"
  },
  "message": null
}
```

**Error Cases:**

| 상태 코드 | 조건 | 응답 메시지 |
|-----------|------|------------|
| 401 | 인증 토큰 없음/만료 | "인증이 필요합니다" |
| 422 | 프로젝트명 누락 | "프로젝트명은 필수입니다" |

---

### 3.2 프로젝트 목록 조회

사용자가 멤버로 속한 프로젝트 목록을 조회한다.

```
GET /api/v1/projects
```

**인증 필요:** 예

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `page` | integer | N | 1 | 페이지 번호 |
| `size` | integer | N | 20 | 페이지당 항목 수 (최대 100) |

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "웹사이트 리뉴얼",
        "description": "회사 홈페이지 전면 리디자인 프로젝트",
        "owner_id": "550e8400-e29b-41d4-a716-446655440000",
        "member_count": 5,
        "task_summary": {
          "todo": 8,
          "in_progress": 4,
          "done": 12
        },
        "created_at": "2025-01-15T09:00:00Z",
        "updated_at": "2025-01-20T14:30:00Z"
      }
    ],
    "total": 3,
    "page": 1,
    "size": 20
  },
  "message": null
}
```

---

### 3.3 프로젝트 상세 조회

특정 프로젝트의 상세 정보를 조회한다.

```
GET /api/v1/projects/{project_id}
```

**인증 필요:** 예 (프로젝트 멤버만)

**Path Parameters:**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `project_id` | UUID | 프로젝트 ID |

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "웹사이트 리뉴얼",
    "description": "회사 홈페이지 전면 리디자인 프로젝트",
    "owner_id": "550e8400-e29b-41d4-a716-446655440000",
    "members": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "김수진",
        "email": "sujin@example.com",
        "role": "owner"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "이정호",
        "email": "jungho@example.com",
        "role": "member"
      }
    ],
    "created_at": "2025-01-15T09:00:00Z",
    "updated_at": "2025-01-20T14:30:00Z"
  },
  "message": null
}
```

**Error Cases:**

| 상태 코드 | 조건 | 응답 메시지 |
|-----------|------|------------|
| 403 | 프로젝트 멤버가 아님 | "이 프로젝트에 접근할 권한이 없습니다" |
| 404 | 프로젝트 없음 | "프로젝트를 찾을 수 없습니다" |

---

### 3.4 프로젝트 수정

프로젝트 정보를 수정한다.

```
PATCH /api/v1/projects/{project_id}
```

**인증 필요:** 예 (소유자만)

**Request Body:**

```json
{
  "name": "웹사이트 리뉴얼 v2",
  "description": "수정된 설명"
}
```

| 필드 | 타입 | 필수 | 유효성 검증 |
|------|------|------|-------------|
| `name` | string | N | 최소 1자, 최대 100자 |
| `description` | string | N | 최대 500자 |

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "웹사이트 리뉴얼 v2",
    "description": "수정된 설명",
    "owner_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2025-01-15T09:00:00Z",
    "updated_at": "2025-01-21T10:00:00Z"
  },
  "message": null
}
```

**Error Cases:**

| 상태 코드 | 조건 | 응답 메시지 |
|-----------|------|------------|
| 403 | 소유자가 아님 | "프로젝트 소유자만 수정할 수 있습니다" |
| 404 | 프로젝트 없음 | "프로젝트를 찾을 수 없습니다" |

---

### 3.5 프로젝트 삭제

프로젝트를 삭제한다 (소프트 삭제).

```
DELETE /api/v1/projects/{project_id}
```

**인증 필요:** 예 (소유자만)

**Response (204 No Content):**

응답 본문 없음.

**Error Cases:**

| 상태 코드 | 조건 | 응답 메시지 |
|-----------|------|------------|
| 403 | 소유자가 아님 | "프로젝트 소유자만 삭제할 수 있습니다" |
| 404 | 프로젝트 없음 | "프로젝트를 찾을 수 없습니다" |

---

### 3.6 멤버 추가

프로젝트에 기존 사용자를 멤버로 추가한다.

```
POST /api/v1/projects/{project_id}/members
```

**인증 필요:** 예 (소유자만)

**Request Body:**

```json
{
  "email": "jungho@example.com"
}
```

| 필드 | 타입 | 필수 | 유효성 검증 |
|------|------|------|-------------|
| `email` | string | Y | 이메일 형식 |

**Response (201 Created):**

```json
{
  "status": "success",
  "data": {
    "project_id": "660e8400-e29b-41d4-a716-446655440001",
    "user_id": "550e8400-e29b-41d4-a716-446655440002",
    "role": "member",
    "joined_at": "2025-01-16T10:00:00Z"
  },
  "message": null
}
```

**Error Cases:**

| 상태 코드 | 조건 | 응답 메시지 |
|-----------|------|------------|
| 403 | 소유자가 아님 | "프로젝트 소유자만 멤버를 초대할 수 있습니다" |
| 404 | 해당 이메일의 사용자 없음 | "가입된 사용자가 아닙니다" |
| 409 | 이미 멤버임 | "이미 프로젝트 멤버입니다" |

---

### 3.7 멤버 목록 조회

프로젝트 멤버 목록을 조회한다.

```
GET /api/v1/projects/{project_id}/members
```

**인증 필요:** 예 (프로젝트 멤버)

**Response (200 OK):**

```json
{
  "status": "success",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "김수진",
      "email": "sujin@example.com",
      "role": "owner",
      "joined_at": "2025-01-15T09:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "이정호",
      "email": "jungho@example.com",
      "role": "member",
      "joined_at": "2025-01-16T10:00:00Z"
    }
  ],
  "message": null
}
```

---

## 4. 태스크 API (Tasks)

### 4.1 태스크 생성

프로젝트 내에 새 태스크를 생성한다.

```
POST /api/v1/projects/{project_id}/tasks
```

**인증 필요:** 예 (프로젝트 멤버)

**Request Body:**

```json
{
  "title": "로그인 페이지 구현",
  "description": "이메일/비밀번호 입력 폼과 유효성 검증 구현",
  "status": "TODO",
  "priority": "HIGH",
  "assignee_id": "550e8400-e29b-41d4-a716-446655440002"
}
```

| 필드 | 타입 | 필수 | 유효성 검증 |
|------|------|------|-------------|
| `title` | string | Y | 최소 1자, 최대 200자 |
| `description` | string | N | 최대 2000자 |
| `status` | enum | N | `TODO` (기본값), `IN_PROGRESS`, `DONE` |
| `priority` | enum | N | `LOW`, `MEDIUM` (기본값), `HIGH`, `URGENT` |
| `assignee_id` | UUID | N | 프로젝트 멤버의 ID |

**Response (201 Created):**

```json
{
  "status": "success",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440010",
    "project_id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "로그인 페이지 구현",
    "description": "이메일/비밀번호 입력 폼과 유효성 검증 구현",
    "status": "TODO",
    "priority": "HIGH",
    "position": 1,
    "assignee": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "이정호"
    },
    "created_by": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "김수진"
    },
    "created_at": "2025-01-17T11:00:00Z",
    "updated_at": "2025-01-17T11:00:00Z"
  },
  "message": null
}
```

**Error Cases:**

| 상태 코드 | 조건 | 응답 메시지 |
|-----------|------|------------|
| 403 | 프로젝트 멤버가 아님 | "이 프로젝트에 접근할 권한이 없습니다" |
| 404 | 프로젝트 없음 | "프로젝트를 찾을 수 없습니다" |
| 422 | 담당자가 프로젝트 멤버가 아님 | "담당자는 프로젝트 멤버여야 합니다" |

---

### 4.2 태스크 목록 조회

프로젝트 내 태스크 목록을 조회한다. 필터와 정렬을 지원한다.

```
GET /api/v1/projects/{project_id}/tasks
```

**인증 필요:** 예 (프로젝트 멤버)

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `status` | enum | N | 전체 | `TODO`, `IN_PROGRESS`, `DONE` |
| `priority` | enum | N | 전체 | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `assignee_id` | UUID | N | 전체 | 담당자 ID |
| `sort_by` | string | N | `position` | `position`, `created_at`, `priority` |
| `order` | string | N | `asc` | `asc`, `desc` |
| `page` | integer | N | 1 | 페이지 번호 |
| `size` | integer | N | 50 | 페이지당 항목 수 (최대 100) |

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440010",
        "project_id": "660e8400-e29b-41d4-a716-446655440001",
        "title": "로그인 페이지 구현",
        "description": "이메일/비밀번호 입력 폼과 유효성 검증 구현",
        "status": "TODO",
        "priority": "HIGH",
        "position": 1,
        "assignee": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "name": "이정호"
        },
        "created_at": "2025-01-17T11:00:00Z",
        "updated_at": "2025-01-17T11:00:00Z"
      }
    ],
    "total": 24,
    "page": 1,
    "size": 50
  },
  "message": null
}
```

---

### 4.3 태스크 상세 조회

특정 태스크의 상세 정보를 조회한다.

```
GET /api/v1/projects/{project_id}/tasks/{task_id}
```

**인증 필요:** 예 (프로젝트 멤버)

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440010",
    "project_id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "로그인 페이지 구현",
    "description": "이메일/비밀번호 입력 폼과 유효성 검증 구현",
    "status": "TODO",
    "priority": "HIGH",
    "position": 1,
    "assignee": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "이정호",
      "email": "jungho@example.com"
    },
    "created_by": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "김수진"
    },
    "created_at": "2025-01-17T11:00:00Z",
    "updated_at": "2025-01-20T15:30:00Z"
  },
  "message": null
}
```

**Error Cases:**

| 상태 코드 | 조건 | 응답 메시지 |
|-----------|------|------------|
| 403 | 프로젝트 멤버가 아님 | "이 프로젝트에 접근할 권한이 없습니다" |
| 404 | 태스크 없음 | "태스크를 찾을 수 없습니다" |

---

### 4.4 태스크 수정

태스크 정보를 수정한다. 부분 수정(PATCH)을 지원한다.

```
PATCH /api/v1/projects/{project_id}/tasks/{task_id}
```

**인증 필요:** 예 (프로젝트 멤버)

**Request Body:**

```json
{
  "title": "로그인 페이지 구현 (OAuth 포함)",
  "status": "IN_PROGRESS",
  "priority": "URGENT",
  "assignee_id": "550e8400-e29b-41d4-a716-446655440002"
}
```

| 필드 | 타입 | 필수 | 유효성 검증 |
|------|------|------|-------------|
| `title` | string | N | 최소 1자, 최대 200자 |
| `description` | string | N | 최대 2000자 |
| `status` | enum | N | `TODO`, `IN_PROGRESS`, `DONE` |
| `priority` | enum | N | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `assignee_id` | UUID \| null | N | 프로젝트 멤버 ID, null로 해제 가능 |
| `position` | integer | N | 0 이상의 정수 (컬럼 내 순서) |

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440010",
    "project_id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "로그인 페이지 구현 (OAuth 포함)",
    "description": "이메일/비밀번호 입력 폼과 유효성 검증 구현",
    "status": "IN_PROGRESS",
    "priority": "URGENT",
    "position": 1,
    "assignee": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "이정호"
    },
    "created_by": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "김수진"
    },
    "created_at": "2025-01-17T11:00:00Z",
    "updated_at": "2025-01-21T10:00:00Z"
  },
  "message": null
}
```

**Error Cases:**

| 상태 코드 | 조건 | 응답 메시지 |
|-----------|------|------------|
| 403 | 프로젝트 멤버가 아님 | "이 프로젝트에 접근할 권한이 없습니다" |
| 404 | 태스크 없음 | "태스크를 찾을 수 없습니다" |
| 422 | 유효하지 않은 상태값 | "유효하지 않은 상태입니다" |

---

### 4.5 태스크 삭제

태스크를 삭제한다 (소프트 삭제).

```
DELETE /api/v1/projects/{project_id}/tasks/{task_id}
```

**인증 필요:** 예 (프로젝트 멤버)

**Response (204 No Content):**

응답 본문 없음.

**Error Cases:**

| 상태 코드 | 조건 | 응답 메시지 |
|-----------|------|------------|
| 403 | 프로젝트 멤버가 아님 | "이 프로젝트에 접근할 권한이 없습니다" |
| 404 | 태스크 없음 | "태스크를 찾을 수 없습니다" |

---

## 5. API 엔드포인트 요약

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| `POST` | `/api/v1/auth/register` | 회원가입 | X |
| `POST` | `/api/v1/auth/login` | 로그인 | X |
| `POST` | `/api/v1/auth/refresh` | 토큰 갱신 | X |
| `POST` | `/api/v1/projects` | 프로젝트 생성 | O |
| `GET` | `/api/v1/projects` | 프로젝트 목록 조회 | O |
| `GET` | `/api/v1/projects/{id}` | 프로젝트 상세 조회 | O |
| `PATCH` | `/api/v1/projects/{id}` | 프로젝트 수정 | O (소유자) |
| `DELETE` | `/api/v1/projects/{id}` | 프로젝트 삭제 | O (소유자) |
| `POST` | `/api/v1/projects/{id}/members` | 멤버 추가 | O (소유자) |
| `GET` | `/api/v1/projects/{id}/members` | 멤버 목록 조회 | O |
| `POST` | `/api/v1/projects/{id}/tasks` | 태스크 생성 | O |
| `GET` | `/api/v1/projects/{id}/tasks` | 태스크 목록 조회 | O |
| `GET` | `/api/v1/projects/{id}/tasks/{tid}` | 태스크 상세 조회 | O |
| `PATCH` | `/api/v1/projects/{id}/tasks/{tid}` | 태스크 수정 | O |
| `DELETE` | `/api/v1/projects/{id}/tasks/{tid}` | 태스크 삭제 | O |
