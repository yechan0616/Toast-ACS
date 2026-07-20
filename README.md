# Toast ACS — 넘겨줄 수 없는 출입

**외부인 출입을 관리하는 모든 공간**을 위한 양도 불가 출입 인증 시스템이에요. 사옥·오피스 방문자, 공유 시설, 통제 구역처럼 "허가받은 사람만 들어와야 하고, 그 허가가 남에게 넘어가면 안 되는" 곳이면 어디든 쓸 수 있어요.

관리자가 외부인에게 출입 권한을 내주면, 그 권한은 **받은 기기에서만** 동작해요. QR·공용 비밀번호·출입증 대여처럼 손쉽게 넘겨줄 수 있는 방식과 달리, **기기 단위 인증**(HMAC 회전 토큰 · HttpOnly 쿠키 · Session Kill · 현장 확인)으로 권한 공유를 원천 차단해요.

한 줄로 말하면, **"게이트 앞에서 버튼 한 번으로 들어가되, 그 인증은 남에게 넘길 수 없다"** 를 만드는 프로젝트예요.

## 구성

```
frontend/   pnpm 모노레포 — apps/client(이용자) · apps/admin(관리자) · packages/{ui,shared}
backend/    Spring Boot 3 (Java 21) + PostgreSQL
hardware/   Arduino Nano ESP32(게이트) + Uno(구동부) 펌웨어 · USB 브리지
deploy/     라즈베리파이 배포 — Docker Compose + Cloudflare Tunnel
```

포트는 client `:3000`, admin `:3001`, 백엔드 `:8080`을 써요.

## 빠르게 실행하기

JDK는 없어도 돼요 — DB와 백엔드를 전부 Docker로 띄워요.

```sh
# 1. DB
docker run -d --name acs-pg -p 5432:5432 \
  -e POSTGRES_DB=acs -e POSTGRES_USER=acs -e POSTGRES_PASSWORD=acs postgres:16

# 2. 백엔드 (:8080)
cd backend && ./gradlew bootRun
# JDK가 없으면 Docker로 실행해요:
# docker build -t acs-api . && docker run --rm -p 8080:8080 \
#   -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/acs \
#   -e SPRING_DATASOURCE_USERNAME=acs -e SPRING_DATASOURCE_PASSWORD=acs acs-api

# 3. 프론트 (다른 터미널)
cd frontend && pnpm install
pnpm dev          # client(:3000) + admin(:3001) 동시 실행
pnpm dev:client   # 이용자 앱만
pnpm dev:admin    # 관리자 앱만
```

`/api/*` 요청은 각 Next.js 앱이 백엔드로 프록시해서 브라우저 기준 same-origin을 유지해요.

## 이렇게 써요

### 이용자 (client · :3000)

1. **서비스 요청** — 처음이면 이름 → 연락처 → 사유를 입력해 요청을 보내요. 이때 이 기기에 요청이 묶여요.
2. **승인 대기** — 관리자가 승인하면 홈에서 바로 알려줘요. 앱을 껐다 켜도 상태가 이어져요.
3. **서비스 등록** — 발급된 인증코드로 이 기기를 등록해요. 코드는 **요청한 기기에서만** 등록돼서 다른 기기로는 넘길 수 없어요. 이미 코드를 받았다면 홈의 `서비스 등록`으로 바로 입력해도 돼요.
4. **딸깍 입장/퇴장** — 게이트 앞에서 `입장하기`를 누르면 열려요. 나갈 때도 게이트 앞에서 `퇴장하기`를 눌러요.

### 관리자 (admin · :3001)

- **로그인** — 로그인해야 화면이 보여요.
- **대시보드** — 재실 인원, 활성 기기, 승인 대기, 누적 출입, 오늘 입장·거부·세션 킬·경보를 실시간(3초 폴링)으로 봐요. 게이트 상태와 원격 개방 버튼도 여기 있어요.
- **이용권 신청** — 신청을 승인(시간권 24시간 / 기간권 30일 선택)하거나 거절해요.
- **활성 기기** — 어떤 이용권이 어떤 기기에 등록됐고 몇 번 출입했는지 보고, 필요하면 사유를 적어 **강제 취소**할 수 있어요.
- **로그·경보** — 출입·거부·세션 킬 로그와 경보를 페이지 단위로 확인해요.

### 게이트 (hardware)

USB 유선 모드가 기본이라 대회장 전파 환경과 무관해요. Nano ESP32를 맥에 USB-C로 연결하고 브리지를 실행하면, 브리지가 폴링을 로컬 백엔드로 중계해요.

```sh
cd hardware/bridge
npm install   # 최초 1회
npm start
```

자세한 배선·펌웨어 업로드·Wi-Fi 모드는 `hardware/README.md`를 참고해요.

### 공격 시연 (client `/demo`)

실제 API를 공격 조건 그대로 호출해 서버가 막아내는 걸 눈으로 보여줘요. 미각인 입장, 만료 토큰, 토큰 재사용, 원격 입장, 안티패스백, 위조 코드까지 각각 예상 코드와 실제 결과가 일치하는지(✓/✗) 표시해요.

## 로컬 기본값

로컬 프로파일 전용이에요. 배포할 때는 전부 환경변수로 바꿔요.

| 항목 | 값 |
|---|---|
| 관리자 계정 | `yechan0616@icloud.com` / `password1234` (`ACS_ADMIN_USERNAME` · `ACS_ADMIN_PASSWORD`) |
| 이용권 샘플 코드 | `DEMO-1234` (기간권) · `TIME-5678` (시간권) |
| 게이트 키 | `dev-gate-key-change-me` (`ACS_GATE_KEY`) |
| 서비스·게이트 이름 | `The Toast` · `본사 정문 출입구` (`ACS_SERVICE_NAME` · `ACS_GATE_NAME`) |
| API 문서 | http://localhost:8080/swagger-ui |

## 배포

라즈베리파이 상시 서버로 Docker Compose + Cloudflare Tunnel로 올려요. 자세한 건 `deploy/README.md`를 참고해요.

## 설계 문서 (내부)

문제 정의·5겹 보안 원리·API 계약·구조 등 상세 설계는 팀 내부 `project_detail/` 폴더에 있어요(공개 저장소에는 올리지 않아요).
