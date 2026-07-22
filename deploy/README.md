# 배포

Docker Compose와 Cloudflare Tunnel로 올려요. 포트를 열지 않고 터널로만 노출해요.

## 순서

1. 이 폴더에 `.env` 파일을 만들어요.

   ```sh
   POSTGRES_PASSWORD=바꿔라
   ACS_HMAC_SECRET=바꾸라고
   ACS_GATE_KEY=바꿔ㅈㅂ
   ACS_ADMIN_USERNAME=관리자아이디
   ACS_ADMIN_PASSWORD=관리자비밀번호
   TUNNEL_TOKEN=클라우드플레어_터널_토큰
   ```

2. 올려요.

   ```sh
   docker compose up -d --build
   ```

3. Cloudflare 대시보드에서 터널 라우팅을 잡아요. client, admin, api 서비스에 각각 도메인을 연결하면 돼요.

## 확인

- admin 도메인으로 접속해서 로그인이 되는지 봐요.
- 게이트(`config.h`의 `API_BASE`)에는 api 도메인을 넣어요.
- 폰은 셀룰러 그대로 client 도메인에 접속하면 돼요.

문제가 생기면 `docker compose logs -f api`부터 보세요.
