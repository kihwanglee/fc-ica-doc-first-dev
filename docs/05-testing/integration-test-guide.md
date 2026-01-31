# 통합 테스트 가이드 (Integration Test Guide)

## 프로젝트: TaskFlow — 태스크 관리 SaaS

> Docker Compose로 프론트엔드, 백엔드, DB를 모두 실행한 뒤, 시스템이 올바르게 동작하는지 검증하는 방법을 정리한다.

---

## 1. 개요

### 1.1 왜 통합 테스트가 필요한가

유닛 테스트는 개별 함수나 모듈이 올바른지 확인하지만, 실제 사용자 시나리오에서 서비스들이 **함께** 동작하는지는 보장하지 못한다. 통합 테스트는 다음을 검증한다:

- Docker 컨테이너들이 정상적으로 기동되는가
- 백엔드가 PostgreSQL에 올바르게 연결되는가
- API 엔드포인트가 설계 문서대로 응답하는가
- 프론트엔드가 백엔드 API를 통해 데이터를 주고받는가
- 회원가입 → 로그인 → 프로젝트 생성 → 태스크 관리의 전체 흐름이 동작하는가

### 1.2 테스트 전략

| 수준 | 도구 | 검증 대상 | 사용 시점 |
|------|------|-----------|-----------|
| **API 스모크 테스트** | curl / httpie | 각 엔드포인트 응답 확인 | docker compose up 직후 빠른 검증 |
| **API 자동화 테스트** | Python (requests/httpx) | 전체 API 흐름, 에러 케이스 | CI/CD 파이프라인, 기능 변경 후 회귀 테스트 |
| **E2E 테스트** | Playwright | 브라우저에서 사용자 시나리오 재현 | 배포 전 최종 검증, UI 변경 후 회귀 테스트 |

### 1.3 사전 조건

모든 테스트는 Docker Compose로 서비스가 실행된 상태에서 수행한다.

```bash
# 서비스 시작 (빌드 포함)
docker compose up --build -d

# 서비스 상태 확인
docker compose ps

# 로그 확인 (문제 발생 시)
docker compose logs backend
docker compose logs frontend
docker compose logs db
```

서비스가 완전히 기동될 때까지 대기한다:
- Backend: `http://localhost:8000/docs` 접속 가능
- Frontend: `http://localhost:3000` 접속 가능

---

## 2. curl을 이용한 API 스모크 테스트

가장 간단한 방법이다. 터미널에서 직접 실행하여 각 엔드포인트가 정상 응답하는지 확인한다.

### 2.1 전체 흐름 테스트 스크립트

아래 스크립트를 `tests/smoke-test.sh`로 저장하고 실행할 수 있다.

```bash
#!/bin/bash
# TaskFlow API 스모크 테스트
# 사용법: bash tests/smoke-test.sh

set -e

BASE_URL="http://localhost:8000/api/v1"
TIMESTAMP=$(date +%s)
TEST_EMAIL="testuser_${TIMESTAMP}@example.com"
TEST_PASSWORD="testpassword123"
TEST_NAME="테스트유저"

echo "======================================"
echo " TaskFlow API 스모크 테스트"
echo "======================================"

# ----------------------------------------
# 1. 회원가입
# ----------------------------------------
echo ""
echo "[1/7] 회원가입..."
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${TEST_EMAIL}\",
    \"password\": \"${TEST_PASSWORD}\",
    \"name\": \"${TEST_NAME}\"
  }")

HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -1)
BODY=$(echo "$REGISTER_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ]; then
  echo "  ✓ 회원가입 성공 (201)"
else
  echo "  ✗ 회원가입 실패 (${HTTP_CODE})"
  echo "  응답: ${BODY}"
  exit 1
fi

# 토큰 추출 (jq 필요)
ACCESS_TOKEN=$(echo "$BODY" | jq -r '.data.access_token')

if [ "$ACCESS_TOKEN" = "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo "  ✗ 토큰 추출 실패"
  exit 1
fi
echo "  ✓ 토큰 추출 완료"

# ----------------------------------------
# 2. 로그인
# ----------------------------------------
echo ""
echo "[2/7] 로그인..."
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${TEST_EMAIL}\",
    \"password\": \"${TEST_PASSWORD}\"
  }")

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "  ✓ 로그인 성공 (200)"
  ACCESS_TOKEN=$(echo "$BODY" | jq -r '.data.access_token')
else
  echo "  ✗ 로그인 실패 (${HTTP_CODE})"
  echo "  응답: ${BODY}"
  exit 1
fi

# ----------------------------------------
# 3. 프로젝트 생성
# ----------------------------------------
echo ""
echo "[3/7] 프로젝트 생성..."
PROJECT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d "{
    \"name\": \"테스트 프로젝트\",
    \"description\": \"스모크 테스트용 프로젝트\"
  }")

HTTP_CODE=$(echo "$PROJECT_RESPONSE" | tail -1)
BODY=$(echo "$PROJECT_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ]; then
  echo "  ✓ 프로젝트 생성 성공 (201)"
  PROJECT_ID=$(echo "$BODY" | jq -r '.data.id')
  echo "  프로젝트 ID: ${PROJECT_ID}"
else
  echo "  ✗ 프로젝트 생성 실패 (${HTTP_CODE})"
  echo "  응답: ${BODY}"
  exit 1
fi

# ----------------------------------------
# 4. 프로젝트 목록 조회
# ----------------------------------------
echo ""
echo "[4/7] 프로젝트 목록 조회..."
LIST_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "${BASE_URL}/projects" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

HTTP_CODE=$(echo "$LIST_RESPONSE" | tail -1)

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "  ✓ 프로젝트 목록 조회 성공 (200)"
else
  echo "  ✗ 프로젝트 목록 조회 실패 (${HTTP_CODE})"
  exit 1
fi

# ----------------------------------------
# 5. 태스크 생성
# ----------------------------------------
echo ""
echo "[5/7] 태스크 생성..."
TASK_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/projects/${PROJECT_ID}/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d "{
    \"title\": \"테스트 태스크\",
    \"description\": \"스모크 테스트로 생성된 태스크\",
    \"priority\": \"HIGH\"
  }")

HTTP_CODE=$(echo "$TASK_RESPONSE" | tail -1)
BODY=$(echo "$TASK_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ]; then
  echo "  ✓ 태스크 생성 성공 (201)"
  TASK_ID=$(echo "$BODY" | jq -r '.data.id')
  echo "  태스크 ID: ${TASK_ID}"
else
  echo "  ✗ 태스크 생성 실패 (${HTTP_CODE})"
  echo "  응답: ${BODY}"
  exit 1
fi

# ----------------------------------------
# 6. 태스크 상태 변경 (TODO → IN_PROGRESS)
# ----------------------------------------
echo ""
echo "[6/7] 태스크 상태 변경 (TODO → IN_PROGRESS)..."
PATCH_RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH \
  "${BASE_URL}/projects/${PROJECT_ID}/tasks/${TASK_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d '{"status": "IN_PROGRESS"}')

HTTP_CODE=$(echo "$PATCH_RESPONSE" | tail -1)

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "  ✓ 태스크 상태 변경 성공 (200)"
else
  echo "  ✗ 태스크 상태 변경 실패 (${HTTP_CODE})"
  exit 1
fi

# ----------------------------------------
# 7. 태스크 목록 조회
# ----------------------------------------
echo ""
echo "[7/7] 태스크 목록 조회..."
TASKS_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET \
  "${BASE_URL}/projects/${PROJECT_ID}/tasks" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

HTTP_CODE=$(echo "$TASKS_RESPONSE" | tail -1)

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "  ✓ 태스크 목록 조회 성공 (200)"
else
  echo "  ✗ 태스크 목록 조회 실패 (${HTTP_CODE})"
  exit 1
fi

# ----------------------------------------
# 결과 요약
# ----------------------------------------
echo ""
echo "======================================"
echo " 모든 스모크 테스트 통과!"
echo "======================================"
echo ""
echo "테스트 계정: ${TEST_EMAIL}"
echo "프로젝트 ID: ${PROJECT_ID}"
echo "태스크 ID:   ${TASK_ID}"
```

### 2.2 실행 방법

```bash
# jq 설치 (토큰 파싱에 필요)
# macOS: brew install jq
# Ubuntu: sudo apt-get install jq

# 실행
bash tests/smoke-test.sh
```

### 2.3 개별 엔드포인트 테스트 (수동)

특정 엔드포인트만 빠르게 확인하고 싶을 때:

```bash
# 회원가입
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "name": "테스트"}'

# 로그인
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# 프로젝트 생성 (TOKEN을 로그인 응답에서 복사)
curl -X POST http://localhost:8000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name": "내 프로젝트", "description": "설명"}'
```

---

## 3. Python을 이용한 API 자동화 테스트

체계적인 테스트와 에러 케이스 검증에 적합하다. CI/CD 파이프라인에 포함할 수 있다.

### 3.1 의존성 설치

```bash
pip install requests pytest
```

### 3.2 테스트 코드

아래 코드를 `tests/test_api.py`로 저장한다.

```python
"""
TaskFlow API 통합 테스트

사용법:
    docker compose up -d
    pip install requests pytest
    pytest tests/test_api.py -v
"""

import time
import requests
import pytest

BASE_URL = "http://localhost:8000/api/v1"


@pytest.fixture(scope="module")
def test_user():
    """테스트용 사용자를 생성하고 인증 정보를 반환한다."""
    timestamp = int(time.time())
    email = f"testuser_{timestamp}@example.com"
    password = "testpassword123"
    name = "테스트유저"

    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={"email": email, "password": password, "name": name},
    )
    assert response.status_code == 201, f"회원가입 실패: {response.text}"

    data = response.json()["data"]
    return {
        "email": email,
        "password": password,
        "name": name,
        "user_id": data["user"]["id"],
        "access_token": data["access_token"],
        "refresh_token": data["refresh_token"],
    }


@pytest.fixture(scope="module")
def auth_headers(test_user):
    """인증 헤더를 반환한다."""
    return {"Authorization": f"Bearer {test_user['access_token']}"}


# ============================================================
# 인증 테스트
# ============================================================


class TestAuth:
    """인증 API 테스트"""

    def test_register_success(self):
        """회원가입이 정상 동작한다."""
        timestamp = int(time.time() * 1000)
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json={
                "email": f"newuser_{timestamp}@example.com",
                "password": "password123",
                "name": "신규유저",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["status"] == "success"
        assert "access_token" in data["data"]
        assert "refresh_token" in data["data"]

    def test_register_duplicate_email(self, test_user):
        """이미 가입된 이메일로 회원가입하면 409를 반환한다."""
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json={
                "email": test_user["email"],
                "password": "password123",
                "name": "중복유저",
            },
        )
        assert response.status_code == 409

    def test_register_short_password(self):
        """비밀번호가 8자 미만이면 422를 반환한다."""
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json={
                "email": "short@example.com",
                "password": "short",
                "name": "짧은비번",
            },
        )
        assert response.status_code == 422

    def test_login_success(self, test_user):
        """올바른 자격 증명으로 로그인하면 토큰을 반환한다."""
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={
                "email": test_user["email"],
                "password": test_user["password"],
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "access_token" in data["data"]

    def test_login_wrong_password(self, test_user):
        """잘못된 비밀번호로 로그인하면 401을 반환한다."""
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={
                "email": test_user["email"],
                "password": "wrongpassword",
            },
        )
        assert response.status_code == 401

    def test_access_without_token(self):
        """토큰 없이 보호된 엔드포인트에 접근하면 401을 반환한다."""
        response = requests.get(f"{BASE_URL}/projects")
        assert response.status_code in [401, 403]


# ============================================================
# 프로젝트 테스트
# ============================================================


class TestProjects:
    """프로젝트 API 테스트"""

    @pytest.fixture(scope="class")
    def project(self, auth_headers):
        """테스트용 프로젝트를 생성한다."""
        response = requests.post(
            f"{BASE_URL}/projects",
            headers=auth_headers,
            json={
                "name": "API 테스트 프로젝트",
                "description": "통합 테스트용 프로젝트",
            },
        )
        assert response.status_code == 201
        return response.json()["data"]

    def test_create_project(self, auth_headers):
        """프로젝트를 생성하면 201을 반환한다."""
        response = requests.post(
            f"{BASE_URL}/projects",
            headers=auth_headers,
            json={"name": "새 프로젝트"},
        )
        assert response.status_code == 201
        data = response.json()["data"]
        assert data["name"] == "새 프로젝트"

    def test_list_projects(self, auth_headers, project):
        """프로젝트 목록을 조회할 수 있다."""
        response = requests.get(
            f"{BASE_URL}/projects",
            headers=auth_headers,
        )
        assert response.status_code == 200

    def test_get_project_detail(self, auth_headers, project):
        """프로젝트 상세 정보를 조회할 수 있다."""
        response = requests.get(
            f"{BASE_URL}/projects/{project['id']}",
            headers=auth_headers,
        )
        assert response.status_code == 200

    def test_update_project(self, auth_headers, project):
        """프로젝트 이름을 수정할 수 있다."""
        response = requests.patch(
            f"{BASE_URL}/projects/{project['id']}",
            headers=auth_headers,
            json={"name": "수정된 프로젝트명"},
        )
        assert response.status_code == 200
        assert response.json()["data"]["name"] == "수정된 프로젝트명"


# ============================================================
# 태스크 테스트
# ============================================================


class TestTasks:
    """태스크 API 테스트"""

    @pytest.fixture(scope="class")
    def project(self, auth_headers):
        """태스크 테스트용 프로젝트를 생성한다."""
        response = requests.post(
            f"{BASE_URL}/projects",
            headers=auth_headers,
            json={"name": "태스크 테스트 프로젝트"},
        )
        assert response.status_code == 201
        return response.json()["data"]

    @pytest.fixture(scope="class")
    def task(self, auth_headers, project):
        """테스트용 태스크를 생성한다."""
        response = requests.post(
            f"{BASE_URL}/projects/{project['id']}/tasks",
            headers=auth_headers,
            json={
                "title": "테스트 태스크",
                "description": "통합 테스트로 생성된 태스크",
                "priority": "HIGH",
            },
        )
        assert response.status_code == 201
        return response.json()["data"]

    def test_create_task(self, auth_headers, project):
        """태스크를 생성하면 201을 반환한다."""
        response = requests.post(
            f"{BASE_URL}/projects/{project['id']}/tasks",
            headers=auth_headers,
            json={"title": "새 태스크"},
        )
        assert response.status_code == 201
        data = response.json()["data"]
        assert data["title"] == "새 태스크"
        assert data["status"] == "TODO"

    def test_list_tasks(self, auth_headers, project, task):
        """태스크 목록을 조회할 수 있다."""
        response = requests.get(
            f"{BASE_URL}/projects/{project['id']}/tasks",
            headers=auth_headers,
        )
        assert response.status_code == 200

    def test_update_task_status(self, auth_headers, project, task):
        """태스크 상태를 변경할 수 있다 (칸반 이동)."""
        response = requests.patch(
            f"{BASE_URL}/projects/{project['id']}/tasks/{task['id']}",
            headers=auth_headers,
            json={"status": "IN_PROGRESS"},
        )
        assert response.status_code == 200
        assert response.json()["data"]["status"] == "IN_PROGRESS"

    def test_update_task_priority(self, auth_headers, project, task):
        """태스크 우선순위를 변경할 수 있다."""
        response = requests.patch(
            f"{BASE_URL}/projects/{project['id']}/tasks/{task['id']}",
            headers=auth_headers,
            json={"priority": "URGENT"},
        )
        assert response.status_code == 200
        assert response.json()["data"]["priority"] == "URGENT"

    def test_delete_task(self, auth_headers, project):
        """태스크를 삭제하면 204를 반환한다."""
        # 삭제용 태스크 생성
        create_resp = requests.post(
            f"{BASE_URL}/projects/{project['id']}/tasks",
            headers=auth_headers,
            json={"title": "삭제할 태스크"},
        )
        task_id = create_resp.json()["data"]["id"]

        response = requests.delete(
            f"{BASE_URL}/projects/{project['id']}/tasks/{task_id}",
            headers=auth_headers,
        )
        assert response.status_code == 204


# ============================================================
# 전체 흐름 테스트 (End-to-End Scenario)
# ============================================================


class TestFullFlow:
    """회원가입 → 로그인 → 프로젝트 생성 → 태스크 관리 전체 흐름"""

    def test_complete_user_journey(self):
        """사용자의 전체 여정이 정상 동작한다."""
        timestamp = int(time.time() * 1000)
        email = f"journey_{timestamp}@example.com"

        # 1. 회원가입
        resp = requests.post(
            f"{BASE_URL}/auth/register",
            json={"email": email, "password": "password123", "name": "여정유저"},
        )
        assert resp.status_code == 201
        token = resp.json()["data"]["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. 프로젝트 생성
        resp = requests.post(
            f"{BASE_URL}/projects",
            headers=headers,
            json={"name": "여정 프로젝트", "description": "전체 흐름 테스트"},
        )
        assert resp.status_code == 201
        project_id = resp.json()["data"]["id"]

        # 3. 태스크 생성 (TODO)
        resp = requests.post(
            f"{BASE_URL}/projects/{project_id}/tasks",
            headers=headers,
            json={"title": "첫 번째 태스크", "priority": "HIGH"},
        )
        assert resp.status_code == 201
        task_id = resp.json()["data"]["id"]
        assert resp.json()["data"]["status"] == "TODO"

        # 4. 태스크 상태 변경 (TODO → IN_PROGRESS)
        resp = requests.patch(
            f"{BASE_URL}/projects/{project_id}/tasks/{task_id}",
            headers=headers,
            json={"status": "IN_PROGRESS"},
        )
        assert resp.status_code == 200
        assert resp.json()["data"]["status"] == "IN_PROGRESS"

        # 5. 태스크 상태 변경 (IN_PROGRESS → DONE)
        resp = requests.patch(
            f"{BASE_URL}/projects/{project_id}/tasks/{task_id}",
            headers=headers,
            json={"status": "DONE"},
        )
        assert resp.status_code == 200
        assert resp.json()["data"]["status"] == "DONE"

        # 6. 태스크 목록에서 DONE 상태 확인
        resp = requests.get(
            f"{BASE_URL}/projects/{project_id}/tasks?status=DONE",
            headers=headers,
        )
        assert resp.status_code == 200
```

### 3.3 실행 방법

```bash
# 기본 실행
pytest tests/test_api.py -v

# 특정 클래스만 실행
pytest tests/test_api.py::TestAuth -v
pytest tests/test_api.py::TestProjects -v
pytest tests/test_api.py::TestTasks -v

# 전체 흐름 테스트만 실행
pytest tests/test_api.py::TestFullFlow -v

# 실패 시 즉시 중단
pytest tests/test_api.py -v -x
```

### 3.4 예상 출력

```
tests/test_api.py::TestAuth::test_register_success PASSED
tests/test_api.py::TestAuth::test_register_duplicate_email PASSED
tests/test_api.py::TestAuth::test_register_short_password PASSED
tests/test_api.py::TestAuth::test_login_success PASSED
tests/test_api.py::TestAuth::test_login_wrong_password PASSED
tests/test_api.py::TestAuth::test_access_without_token PASSED
tests/test_api.py::TestProjects::test_create_project PASSED
tests/test_api.py::TestProjects::test_list_projects PASSED
tests/test_api.py::TestProjects::test_get_project_detail PASSED
tests/test_api.py::TestProjects::test_update_project PASSED
tests/test_api.py::TestTasks::test_create_task PASSED
tests/test_api.py::TestTasks::test_list_tasks PASSED
tests/test_api.py::TestTasks::test_update_task_status PASSED
tests/test_api.py::TestTasks::test_update_task_priority PASSED
tests/test_api.py::TestTasks::test_delete_task PASSED
tests/test_api.py::TestFullFlow::test_complete_user_journey PASSED
```

---

## 4. Playwright를 이용한 E2E 테스트

브라우저에서 실제 사용자의 동작을 재현하여 프론트엔드와 백엔드가 함께 올바르게 동작하는지 검증한다.

### 4.1 의존성 설치

```bash
# Playwright 설치
pip install playwright pytest-playwright

# 브라우저 엔진 설치
playwright install chromium
```

### 4.2 테스트 코드

아래 코드를 `tests/test_e2e.py`로 저장한다.

```python
"""
TaskFlow E2E 테스트 (Playwright)

사용법:
    docker compose up -d
    pip install playwright pytest-playwright
    playwright install chromium
    pytest tests/test_e2e.py -v
"""

import time
import re

import pytest
from playwright.sync_api import Page, expect


BASE_URL = "http://localhost:3000"


@pytest.fixture(scope="module")
def test_credentials():
    """고유한 테스트 계정 정보를 생성한다."""
    timestamp = int(time.time())
    return {
        "email": f"e2e_user_{timestamp}@example.com",
        "password": "testpassword123",
        "name": "E2E테스트유저",
    }


class TestRegistrationAndLogin:
    """회원가입 및 로그인 E2E 테스트"""

    def test_register_new_user(self, page: Page, test_credentials):
        """신규 사용자가 회원가입할 수 있다."""
        page.goto(f"{BASE_URL}/login")

        # 회원가입 탭/모드로 전환 (UI에 따라 조정 필요)
        register_tab = page.get_by_text("회원가입")
        if register_tab.is_visible():
            register_tab.click()

        # 폼 입력
        page.get_by_placeholder("이름").fill(test_credentials["name"])
        page.get_by_placeholder("이메일").fill(test_credentials["email"])
        page.get_by_placeholder("비밀번호").fill(test_credentials["password"])

        # 제출
        page.get_by_role("button", name=re.compile("가입|등록|회원가입")).click()

        # 대시보드로 이동 확인
        page.wait_for_url(f"{BASE_URL}/dashboard", timeout=10000)
        expect(page).to_have_url(re.compile(r"/dashboard"))

    def test_login_existing_user(self, page: Page, test_credentials):
        """기존 사용자가 로그인할 수 있다."""
        page.goto(f"{BASE_URL}/login")

        # 로그인 탭/모드 확인
        login_tab = page.get_by_text("로그인")
        if login_tab.is_visible():
            login_tab.click()

        # 폼 입력
        page.get_by_placeholder("이메일").fill(test_credentials["email"])
        page.get_by_placeholder("비밀번호").fill(test_credentials["password"])

        # 제출
        page.get_by_role("button", name=re.compile("로그인")).click()

        # 대시보드로 이동 확인
        page.wait_for_url(f"{BASE_URL}/dashboard", timeout=10000)
        expect(page).to_have_url(re.compile(r"/dashboard"))


class TestProjectManagement:
    """프로젝트 관리 E2E 테스트"""

    @pytest.fixture(autouse=True)
    def login(self, page: Page, test_credentials):
        """각 테스트 전에 로그인한다."""
        page.goto(f"{BASE_URL}/login")
        login_tab = page.get_by_text("로그인")
        if login_tab.is_visible():
            login_tab.click()
        page.get_by_placeholder("이메일").fill(test_credentials["email"])
        page.get_by_placeholder("비밀번호").fill(test_credentials["password"])
        page.get_by_role("button", name=re.compile("로그인")).click()
        page.wait_for_url(f"{BASE_URL}/dashboard", timeout=10000)

    def test_create_project(self, page: Page):
        """대시보드에서 프로젝트를 생성할 수 있다."""
        # 프로젝트 생성 버튼 클릭
        page.get_by_role("button", name=re.compile("새.*프로젝트|프로젝트.*생성|생성")).click()

        # 모달에서 프로젝트 정보 입력
        page.get_by_placeholder("프로젝트명").fill("E2E 테스트 프로젝트")

        description_input = page.get_by_placeholder("설명")
        if description_input.is_visible():
            description_input.fill("E2E 테스트로 생성된 프로젝트")

        # 생성 버튼 클릭
        page.get_by_role("button", name=re.compile("생성|만들기")).click()

        # 프로젝트가 목록에 표시되는지 확인
        expect(page.get_by_text("E2E 테스트 프로젝트")).to_be_visible(timeout=10000)

    def test_navigate_to_kanban(self, page: Page):
        """프로젝트를 클릭하면 칸반 보드로 이동한다."""
        # 프로젝트 클릭
        page.get_by_text("E2E 테스트 프로젝트").click()

        # 칸반 보드 컬럼이 표시되는지 확인
        expect(page.get_by_text("TODO")).to_be_visible(timeout=10000)


class TestKanbanBoard:
    """칸반 보드 E2E 테스트"""

    @pytest.fixture(autouse=True)
    def setup_and_login(self, page: Page, test_credentials):
        """로그인 후 프로젝트 보드로 이동한다."""
        page.goto(f"{BASE_URL}/login")
        login_tab = page.get_by_text("로그인")
        if login_tab.is_visible():
            login_tab.click()
        page.get_by_placeholder("이메일").fill(test_credentials["email"])
        page.get_by_placeholder("비밀번호").fill(test_credentials["password"])
        page.get_by_role("button", name=re.compile("로그인")).click()
        page.wait_for_url(f"{BASE_URL}/dashboard", timeout=10000)

        # 프로젝트로 이동
        page.get_by_text("E2E 테스트 프로젝트").click()
        expect(page.get_by_text("TODO")).to_be_visible(timeout=10000)

    def test_create_task_on_board(self, page: Page):
        """칸반 보드에서 태스크를 생성할 수 있다."""
        # 태스크 생성 버튼 클릭
        page.get_by_role("button", name=re.compile("태스크.*생성|추가|\\+")).first.click()

        # 태스크 정보 입력
        page.get_by_placeholder("제목").fill("E2E 태스크")

        # 저장
        page.get_by_role("button", name=re.compile("생성|저장|추가")).click()

        # 보드에 태스크가 표시되는지 확인
        expect(page.get_by_text("E2E 태스크")).to_be_visible(timeout=10000)
```

### 4.3 실행 방법

```bash
# 기본 실행 (headless)
pytest tests/test_e2e.py -v

# 브라우저를 화면에 띄워서 실행 (디버깅용)
pytest tests/test_e2e.py -v --headed

# 속도를 늦춰서 실행 (동작 확인용)
pytest tests/test_e2e.py -v --headed --slowmo=500

# 특정 테스트만 실행
pytest tests/test_e2e.py::TestRegistrationAndLogin -v
pytest tests/test_e2e.py::TestKanbanBoard -v
```

### 4.4 주의 사항

- Playwright E2E 테스트는 실제 UI 셀렉터(placeholder, role, text)에 의존하므로, 프론트엔드 UI가 변경되면 테스트 코드도 함께 수정해야 한다.
- 위 코드는 현재 와이어프레임과 UI 설계 문서를 기반으로 작성되었으며, 실제 구현된 UI의 텍스트나 구조에 맞게 셀렉터를 조정해야 할 수 있다.
- `--headed` 옵션으로 브라우저를 직접 보면서 셀렉터를 확인하는 것이 디버깅에 효과적이다.

---

## 5. 테스트 방식 비교

| 항목 | curl | Python (pytest) | Playwright |
|------|------|-----------------|------------|
| **설치 난이도** | 없음 (기본 내장) | 낮음 (`pip install`) | 중간 (브라우저 엔진 설치) |
| **실행 속도** | 빠름 | 빠름 | 느림 (브라우저 기동) |
| **검증 범위** | API 응답 코드 | API 응답 코드 + 데이터 | 전체 UI + API + DB |
| **에러 케이스** | 수동 확인 | 자동 검증 | 자동 검증 |
| **CI/CD 적합성** | 낮음 | 높음 | 높음 |
| **유지보수 비용** | 낮음 | 중간 | 높음 (UI 변경 시) |
| **추천 용도** | 개발 중 빠른 확인 | 회귀 테스트 자동화 | 배포 전 최종 검증 |

---

## 6. AI를 활용한 테스트 코드 생성

Doc-First 방법론에서 테스트 코드 역시 **문서에서 출발**한다. API 설계 문서와 사용자 스토리를 AI에게 제공하여 테스트 코드를 생성할 수 있다.

### 6.1 테스트 생성 프롬프트 예시

#### curl 스모크 테스트 생성

```
다음 문서를 참조하여 curl 기반 API 스모크 테스트 스크립트를 작성해줘:
- docs/03-architecture/api-design.md

회원가입 → 로그인 → 프로젝트 생성 → 태스크 생성 → 태스크 상태 변경의
전체 흐름을 테스트하는 bash 스크립트로 작성해줘.

각 단계에서:
- HTTP 상태 코드를 확인하고
- 실패 시 에러 메시지를 출력하고 중단하고
- 성공 시 다음 단계에 필요한 값(토큰, ID 등)을 추출해줘

파일 위치: tests/smoke-test.sh
```

#### Python API 테스트 생성

```
다음 문서를 참조하여 Python 기반 API 통합 테스트를 작성해줘:
- docs/03-architecture/api-design.md
- docs/01-requirements/user-stories.md

pytest를 사용하고, 다음을 포함해줘:
1. 인증 테스트 (회원가입, 로그인, 중복 이메일, 잘못된 비밀번호)
2. 프로젝트 CRUD 테스트 (생성, 목록 조회, 상세 조회, 수정)
3. 태스크 CRUD 테스트 (생성, 목록 조회, 상태 변경, 우선순위 변경, 삭제)
4. 전체 흐름 테스트 (회원가입 → 프로젝트 → 태스크 → 상태 변경)

각 테스트는 독립적으로 실행 가능해야 하고,
테스트 데이터는 타임스탬프로 고유하게 생성해줘.

파일 위치: tests/test_api.py
```

#### Playwright E2E 테스트 생성

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

---

## 7. 테스트 디렉토리 구조

```
tests/
├── smoke-test.sh          # curl 기반 스모크 테스트 스크립트
├── test_api.py            # Python API 통합 테스트
├── test_e2e.py            # Playwright E2E 테스트
└── conftest.py            # pytest 공통 설정 (필요 시)
```

---

## 8. 자주 발생하는 문제와 해결

| 문제 | 원인 | 해결 방법 |
|------|------|-----------|
| `Connection refused` | 서비스가 아직 시작되지 않음 | `docker compose ps`로 상태 확인, 로그 확인 |
| `401 Unauthorized` | 토큰이 만료되었거나 잘못됨 | 로그인을 다시 수행하여 새 토큰 발급 |
| `500 Internal Server Error` | 백엔드 오류 (DB 연결 실패 등) | `docker compose logs backend`로 에러 로그 확인 |
| Playwright 셀렉터 실패 | UI 텍스트/구조가 변경됨 | `--headed` 모드로 실행하여 실제 UI 확인 후 셀렉터 수정 |
| 테스트 데이터 충돌 | 동일 이메일로 재실행 | 타임스탬프 기반 고유 이메일 사용 (예시 코드 참고) |
| DB 초기화 필요 | 이전 테스트 데이터가 남아있음 | `docker compose down -v && docker compose up --build -d` |
