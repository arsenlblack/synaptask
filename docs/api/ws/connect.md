---
title: WebSocket Coonnect
slug: /api/ws/ws_connect
---

**Purpose:** Establish an authenticated Socket.IO session.

## Authentication

When connecting with Socket.IO, provide the API token in the `auth` payload:

```js
const socket = io(SERVER_URL, {
  transports: ['websocket'],
  auth: { api_token: '<api_token>' }
});
```
Or send as a header if your client supports it:

```
Sec-WebSocket-Protocol: Bearer, st_xxxxxxxxxxxxxxxxxxxx
```

## Rate Limits
- **Per IP:** `10 / 60s` (bucketed).
- **Per User (connect attempts):** `20 / 60s`.
- **Concurrent connections per user:** `10`.

## Origin Policy (Web only)
- **Prod:** only `synaptask.space` is allowed.

## Server → Client Events
### `connected`
```json
{
  "ok": true,
  "uid": "uuid",
  "client": "web|api",
  "serverTime": "2025-09-13T10:00:00Z"
}
```

## Client → Server
API clients must explicitly request data after the handshake (e.g., `graph:get`).

## Security Notes
- Dual throttling (IP & user) + cap on concurrent SIDs per user.
- No payload is pushed on connect for API clients.
- Disconnect cleanup removes `sid` from both `WS_SID2UID` and `WS_UID2SIDS:{uid}`.

## Error Codes
- Connection rejected (rate limit): transport error `io server disconnect` (client should retry with backoff).
- Connection rejected (origin/auth): same as above; log contains reason on server.
