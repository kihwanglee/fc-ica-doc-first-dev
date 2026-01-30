# 버그 수정 프롬프트 및 AI 응답 기록

## 1. 서비스 상태 확인

### 사용자 프롬프트
> docker compose로 서비스를 실행했다. 현재 상태는 정상인가?

### AI 행동
1. `docker compose ps`로 컨테이너 상태 확인 — 3개 모두 Up
2. `docker compose logs` 로 각 서비스 로그 확인
3. backend 로그에서 `ImportError: email-validator is not installed` 발견
4. `backend/requirements.txt`에서 `pydantic==2.9.2` → `pydantic[email]==2.9.2`로 수정
5. 사용자 승인 후 `docker compose up --build backend -d`로 재빌드

---

## 2. 회원가입 실패 (500 에러)

### 사용자 프롬프트
> 회원 가입 실패한다.

### AI 행동
1. `curl`로 회원가입 API 직접 호출 — `500 Internal Server Error` 확인
2. `docker compose logs backend`에서 에러 스택 트레이스 확인
3. `ValueError: password cannot be longer than 72 bytes` — passlib과 bcrypt 5.x 호환성 문제 파악
4. `backend/requirements.txt`에 `bcrypt==4.2.1` 버전 고정 추가
5. backend 재빌드 후 회원가입 API 재테스트 — 201 Created 성공

---

## 3. 회원가입 실패 (404 에러 — 서버 측)

### 사용자 프롬프트
> Request failed with status 404로 회원 가입 실패한다.

### AI 행동
1. 프론트엔드 `api.ts` 확인 — API 호출 경로: `/auth/register`
2. `main.py` 확인 — `prefix="/api/v1/auth"`로 라우터 등록
3. `auth.py` 확인 — `APIRouter(prefix="/auth")` 추가 설정 발견
4. prefix 중복으로 실제 경로가 `/api/v1/auth/auth/register`가 되는 문제 파악
5. `auth.py`에서 `prefix="/auth"` 제거
6. backend 재빌드 후 API 테스트 — 201 Created 성공

---

## 4. 회원가입 실패 (404 에러 — 브라우저)

### 사용자 프롬프트
> 또 똑같이 실패한다.

### AI 행동
1. curl로는 성공하지만 브라우저에서 실패하는 상황 인식
2. CORS preflight 확인 — 정상
3. frontend 컨테이너의 `NEXT_PUBLIC_API_URL` 환경변수 확인 — `http://localhost:8000`
4. `api.ts`의 `API_BASE` 로직 분석:
   - `NEXT_PUBLIC_API_URL`이 설정되면 fallback(`http://localhost:8000/api/v1`)이 무시됨
   - `http://localhost:8000` + `/auth/register` = `/api/v1` 누락
5. `.env`와 `.env.example`의 `BACKEND_URL`을 `http://localhost:8000/api/v1`로 수정
6. `docker compose up -d frontend`로 재시작
7. 환경변수 적용 확인

---

## 교훈

- **curl 성공 ≠ 브라우저 성공**: curl로 직접 올바른 URL을 호출하면 성공하지만, 프론트엔드가 환경변수를 기반으로 조합하는 URL은 다를 수 있다.
- **prefix 중복 주의**: FastAPI에서 `include_router`의 prefix와 `APIRouter`의 prefix가 합산되므로 한쪽에서만 지정해야 한다.
- **의존성 호환성**: Python 패키지 간 메이저 버전 변경 시 호환성이 깨질 수 있으므로 버전 고정이 중요하다.
