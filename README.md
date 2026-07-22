# Toast ACS

티켓을 남에게 넘길 수 없게 만드는 출입 인증 시스템이에요.

QR 티켓은 캡처 한 장이면 남에게 넘어가요. 그렇게 암표가 생겨요. Toast ACS는 QR을 화면에 띄우지 않아요. 관객 폰이 서버에 직접 입장을 요청하고, 티켓은 처음 등록한 기기에 잠겨요. 캡처할 것도, 넘겨줄 것도 없어요.

자세한 소개와 데모는 [yechan.app/?project=toast-acs](https://www.yechan.app/?project=toast-acs)에서 볼 수 있어요.

2026 학생 SW 융합 해커톤 출품작이에요.

## 구성

```
frontend/   pnpm 모노레포 — apps/client(관객), apps/admin(관리자), packages/{ui,shared}
backend/    Spring Boot 3 (Java 21) + PostgreSQL
hardware/   Arduino Nano ESP32 + Uno R3, 입장·퇴장 개찰구 2개
deploy/     Docker Compose + Cloudflare Tunnel
```

client는 3000, admin은 3001, 백엔드는 8080 포트를 써요.

## 실행하기

DB와 백엔드는 Docker로 띄울 수 있어요. JDK가 없어도 돼요.

```sh
# 1. DB
docker run -d --name acs-pg -p 5432:5432 \
  -e POSTGRES_DB=acs -e POSTGRES_USER=acs -e POSTGRES_PASSWORD=acs postgres:16

# 2. 백엔드 (:8080)
cd backend && ./gradlew bootRun
# JDK가 없다면:
# docker build -t acs-api . && docker run --rm -p 8080:8080 \
#   -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/acs \
#   -e SPRING_DATASOURCE_USERNAME=acs -e SPRING_DATASOURCE_PASSWORD=acs acs-api

# 3. 프론트 (다른 터미널)
cd frontend && pnpm install
pnpm dev          # client와 admin을 같이 실행해요
pnpm dev:client   # 관객 앱만
pnpm dev:admin    # 관리자 앱만
```

`/api/*` 요청은 Next.js가 백엔드로 프록시해요. 브라우저 입장에서는 같은 origin이에요.

## 어떻게 쓰나요

### 관객

1. 이름, 연락처, 사유를 입력하고 좌석을 골라 티켓을 요청해요. 이미 예약된 좌석은 고를 수 없어요.
2. 관리자가 승인하면 홈에서 바로 알려줘요. 앱을 껐다 켜도 이어져요.
3. 발급된 인증코드로 기기를 등록해요. 요청한 기기에서만 등록할 수 있어요.
4. 입장 개찰구 앞에서 입장하기를 눌러요. 나갈 때는 퇴장 개찰구 앞에서 퇴장하기를 눌러요. 반대편 개찰구에서는 통하지 않아요.

### 관리자

- 대시보드에서 재실 인원, 활성 기기, 승인 대기, 게이트 상태를 실시간으로 봐요. 원격 개방도 여기서 해요.
- 티켓 신청을 승인하거나 거절해요.
- 기기 등록 현황을 보고, 필요하면 강제 취소하거나 기기 잠금을 풀어줘요.
- 출입 로그와 경보를 확인해요.

### 게이트

개찰구 2개를 ESP32 하나가 맡아요. 입장 쪽 OLED에는 좌석 현황과 승인 결과("입장 승인 / 좌석 A3")가 뜨고, 퇴장 쪽에는 통과 안내가 떠요. 공격이 차단되면 그 사유도 OLED에 떠요.

기본은 폰 핫스팟으로 서버에 직접 붙는 Wi-Fi 모드예요. 전파가 안 좋으면 USB 브리지로 바꿔요.

```sh
cd hardware/bridge
npm install
npm start
```

배선과 펌웨어 업로드는 `hardware/README.md`를 참고하세요.

### 공격 시연

client의 `/demo`에서 실제 공격을 그대로 날려볼 수 있어요. 미각인 입장, 만료 토큰, 토큰 재사용, 원격 통과, 안티패스백, 위조 티켓. 서버가 어느 단계에서 막았는지 화면에 표시되고, 차단 순간 게이트 OLED에도 사유가 떠요.

## 로컬 기본값

로컬 개발용 값이에요. 배포할 때는 환경변수로 바꿔요.

| 항목 | 값 |
|---|---|
| 관리자 계정 | `yechan0616@icloud.com` / `password1234` |
| 샘플 티켓 | `DEMO-1234` (좌석 A3), `TIME-5678` (좌석 B7) |
| 게이트 키 | `dev-gate-key-change-me` |
| API 문서 | http://localhost:8080/swagger-ui |

## 배포

Docker Compose와 Cloudflare Tunnel로 올려요. `deploy/README.md`를 참고하세요.
