# 버그 수정 및 환경 설정 변경 이력

## 1. email-validator 패키지 누락

- **증상**: Backend 컨테이너 시작 시 `ImportError: email-validator is not installed` 발생
- **원인**: Pydantic 스키마에서 `EmailStr` 타입을 사용하지만 `email-validator` 패키지가 설치되지 않음
- **수정 파일**: `backend/requirements.txt`
- **변경 내용**: `pydantic==2.9.2` → `pydantic[email]==2.9.2`

## 2. passlib과 bcrypt 5.x 호환성 문제

- **증상**: 회원가입 API 호출 시 `500 Internal Server Error` — `ValueError: password cannot be longer than 72 bytes`
- **원인**: `bcrypt 5.0`에서 72바이트 초과 비밀번호 처리 방식이 변경되어 `passlib 1.7.4`의 내부 버그 감지 로직이 실패
- **수정 파일**: `backend/requirements.txt`
- **변경 내용**: `bcrypt==4.2.1` 버전 명시 추가

## 3. Auth 라우터 prefix 중복

- **증상**: 프론트엔드에서 회원가입 시 `404 Not Found` 발생
- **원인**: `main.py`에서 `prefix="/api/v1/auth"`를 지정하고, `auth.py` 라우터에서도 `prefix="/auth"`를 지정하여 실제 경로가 `/api/v1/auth/auth/register`로 이중 적용됨
- **수정 파일**: `backend/app/api/auth.py`
- **변경 내용**: `APIRouter(prefix="/auth", tags=["auth"])` → `APIRouter(tags=["auth"])` (prefix 제거)

## 4. BACKEND_URL 환경변수 경로 불일치

- **증상**: 프론트엔드 브라우저에서 회원가입 시 `404 Not Found` 발생
- **원인**: `BACKEND_URL`이 `http://localhost:8000`으로 설정되어 있었으나, 프론트엔드 `api.ts`의 `API_BASE`가 `NEXT_PUBLIC_API_URL` 값을 그대로 사용하고 path(`/auth/register`)만 붙이므로 `/api/v1`이 누락됨
- **수정 파일**: `.env`, `.env.example`
- **변경 내용**: `BACKEND_URL=http://localhost:8000` → `BACKEND_URL=http://localhost:8000/api/v1`
