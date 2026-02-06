# 7단계: 배포 프롬프트

> 개발된 애플리케이션을 운영 환경에 배포하는 프롬프트입니다.

**참고:** 배포 워크플로우의 전체 흐름은 `docs/tutorial/deployment-guide.md`의 "8. AI Agent를 활용한 배포 워크플로우" 섹션을 참조하세요.

---

## Phase 1: 프로덕션 설정 파일 생성

**참조 문서:** `docs/tutorial/deployment-guide.md` (방법 B)
**산출물:** `docker-compose.prod.yml`, `frontend/Dockerfile.prod`, `nginx/default.conf`

### 7-1-1. docker-compose.prod.yml 생성

```
docs/tutorial/deployment-guide.md의 "방법 B — AWS EC2 + Docker 올인원 배포" 섹션을 참조하여
프로덕션용 docker-compose.prod.yml 파일을 생성해줘.

요구사항:
1. 서비스: db, backend, frontend, nginx
2. db, backend, frontend는 포트를 외부에 노출하지 않음
3. nginx만 80번 포트를 외부에 노출
4. restart: unless-stopped 정책 적용
5. 환경 변수는 .env 파일에서 참조
6. backend는 프로덕션 모드로 실행 (--reload 제거)
7. frontend는 프로덕션 빌드 (Dockerfile.prod 사용)

파일 위치: docker-compose.prod.yml
```

### 7-1-2. frontend/Dockerfile.prod 생성

```
프론트엔드 프로덕션용 Dockerfile을 생성해줘.

요구사항:
1. Multi-stage 빌드 (builder + runner)
2. Node 20-alpine 이미지 사용
3. builder 스테이지에서 npm run build 실행
4. runner 스테이지에서 npm start 실행 (프로덕션 서버)
5. NEXT_PUBLIC_API_URL 환경 변수를 빌드 시 주입
6. 최종 이미지 크기 최소화

파일 위치: frontend/Dockerfile.prod
```

### 7-1-3. Nginx 설정 파일 생성

```
Nginx 리버스 프록시 설정 파일을 생성해줘.

요구사항:
1. 80번 포트 리스닝
2. /api/ 경로 → backend:8000으로 프록시
3. /docs, /openapi.json → backend:8000으로 프록시 (API 문서)
4. / 경로 → frontend:3000으로 프록시
5. WebSocket 지원 (proxy_http_version 1.1, Upgrade 헤더)
6. 프록시 헤더 설정 (Host, X-Real-IP, X-Forwarded-For, X-Forwarded-Proto)

파일 위치: nginx/default.conf
```

### 7-1-4. 환경 변수 템플릿 생성

```
프로덕션 환경 변수 템플릿 파일을 생성해줘.

포함 항목:
1. PostgreSQL 설정 (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB)
2. Backend DB 접속 (DATABASE_URL with asyncpg)
3. JWT 설정 (JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES)
4. 서비스 URL (FRONTEND_URL, BACKEND_URL)

주의사항:
- 실제 값 대신 플레이스홀더 사용 (예: <EC2-PUBLIC-IP>)
- 보안 관련 값은 강력한 비밀번호로 변경하라는 주석 추가
- JWT_SECRET 생성 명령어 주석으로 추가 (openssl rand -hex 32)

파일 위치: .env.production.example
```

---

## Phase 3: 배포 스크립트 생성

**참조 문서:** `docs/tutorial/deployment-guide.md`
**산출물:** `scripts/setup-server.sh`, `scripts/deploy.sh`, `scripts/update.sh`

### 7-3-1. 서버 초기 설정 스크립트

```
AWS EC2 Ubuntu 서버의 초기 설정을 자동화하는 bash 스크립트를 작성해줘.

실행 항목:
1. 시스템 패키지 업데이트 (apt update && apt upgrade)
2. Docker 설치 (공식 저장소 사용)
3. Docker Compose 플러그인 설치
4. 현재 사용자를 docker 그룹에 추가
5. Git 설치
6. 각 단계마다 진행 상황 출력
7. 에러 발생 시 스크립트 중단 (set -e)

파일 위치: scripts/setup-server.sh

스크립트는 최초 1회만 실행되며, EC2 인스턴스에 SSH 접속 후 실행됩니다.
```

### 7-3-2. 초기 배포 스크립트

```
프로젝트를 처음 배포하는 스크립트를 작성해줘.

실행 항목:
1. 환경 변수 파일(.env) 존재 확인
2. docker-compose.prod.yml로 서비스 빌드 및 시작
3. 컨테이너 상태 확인
4. 서비스 헬스 체크 (curl로 localhost 확인)
5. 각 단계마다 성공/실패 메시지 출력
6. 에러 발생 시 스크립트 중단 (set -e)

파일 위치: scripts/deploy.sh

실행 예시: ./scripts/deploy.sh
```

### 7-3-3. 코드 업데이트 스크립트

```
코드 변경 후 재배포하는 스크립트를 작성해줘.

실행 항목:
1. Git으로 최신 코드 pull (git pull origin main)
2. 기존 컨테이너 중지 및 제거
3. 새 이미지 빌드
4. 컨테이너 재시작
5. 미사용 Docker 이미지 정리 (선택적)
6. 각 단계마다 진행 상황 출력

파일 위치: scripts/update.sh

실행 예시: ./scripts/update.sh
```

---

## 배포 관련 유용한 프롬프트

### 프로덕션 설정 검증

```
현재 프로덕션 설정 파일들을 검증해줘.

확인 항목:
1. docker-compose.prod.yml이 문법적으로 올바른가?
2. 외부에 노출되지 않아야 할 포트가 노출되어 있는가?
3. 환경 변수가 올바르게 참조되는가?
4. restart 정책이 설정되어 있는가?
5. 프로덕션 모드로 실행되는가? (개발 모드 플래그 제거)

로컬에서 다음 명령어로 검증:
docker compose -f docker-compose.prod.yml config
```

### Nginx 설정 디버깅

```
Nginx 설정이 동작하지 않는다. 다음을 확인해줘:

문제 상황:
- 증상: [구체적인 증상 설명]
- 브라우저 개발자 도구 에러: [에러 메시지]

확인 항목:
1. upstream 서버 이름이 docker-compose의 서비스명과 일치하는가?
2. location 블록의 순서가 올바른가? (구체적 경로가 먼저)
3. 프록시 헤더가 올바르게 설정되어 있는가?
4. WebSocket 지원이 필요한가?

Nginx 로그 확인 명령어:
docker compose -f docker-compose.prod.yml logs nginx
```

### 환경 변수 트러블슈팅

```
서비스가 실행되지 않는다. 환경 변수 설정을 점검해줘.

확인 항목:
1. .env 파일이 프로젝트 루트에 존재하는가?
2. DATABASE_URL의 호스트명이 'db'인가? (Docker 내부 통신)
3. FRONTEND_URL과 BACKEND_URL이 EC2 퍼블릭 IP를 사용하는가?
4. JWT_SECRET이 설정되어 있는가?
5. NEXT_PUBLIC_ 접두사가 있는 환경 변수는 빌드 시 주입되는가?

컨테이너 환경 변수 확인 명령어:
docker compose -f docker-compose.prod.yml exec backend env
docker compose -f docker-compose.prod.yml exec frontend env
```

### HTTPS 설정 추가 (Let's Encrypt)

```
현재 HTTP로 동작하는 서비스에 HTTPS를 추가해줘.

요구사항:
1. Let's Encrypt Certbot 사용
2. Nginx 설정에 SSL 인증서 경로 추가
3. HTTP → HTTPS 자동 리다이렉트
4. docker-compose.prod.yml에 certbot 서비스 추가
5. 인증서 자동 갱신 설정

참고:
- 도메인: [도메인 입력]
- 이메일: [이메일 입력]

설정 파일 수정 및 certbot 실행 명령어를 알려줘.
```

---

## 배포 후 운영 프롬프트

### 모니터링 스크립트 생성

```
서비스 상태를 모니터링하는 스크립트를 작성해줘.

확인 항목:
1. 모든 컨테이너가 실행 중인가?
2. 디스크 사용량이 80% 미만인가?
3. 메모리 사용량이 80% 미만인가?
4. 프론트엔드/백엔드가 응답하는가? (curl)
5. DB 연결이 정상인가?

이상 발견 시 경고 메시지 출력.

파일 위치: scripts/health-check.sh
```

### 백업 스크립트 생성

```
데이터베이스를 백업하는 스크립트를 작성해줘.

기능:
1. PostgreSQL 데이터 dump (pg_dump)
2. 타임스탬프가 포함된 파일명으로 저장
3. 7일 이상 된 백업 파일 자동 삭제
4. 백업 성공/실패 로그 기록

파일 위치: scripts/backup-db.sh

cron으로 매일 자동 실행할 수 있도록 작성해줘.
```

### 로그 분석 프롬프트

```
Docker 로그를 분석하여 문제를 파악해줘.

로그 수집 명령어:
docker compose -f docker-compose.prod.yml logs --tail 100

다음을 확인해줘:
1. 에러 메시지가 있는가?
2. 컨테이너가 재시작되고 있는가?
3. DB 연결 실패 로그가 있는가?
4. 메모리 부족(OOM) 로그가 있는가?
5. API 호출 실패 패턴이 있는가?

문제의 원인과 해결 방법을 제시해줘.
```
