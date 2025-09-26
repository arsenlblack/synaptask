---
title: WebSocket Connect
slug: /api/ws/ws_connect
---

**Purpose:** Establish an authenticated Socket.IO session.

## Authentication

Provide an API token in the `Authorization` header when establishing the WebSocket connection:

```js
const socket = io(SERVER_URL, {
  transports: ['websocket'],
  extraHeaders: {
    Authorization: 'Bearer <api_token>'
  }
});
```
:::info
All API WebSocket connections require a valid Bearer token in the `Authorization` header
:::
### Python example
```python
import socketio

sio = socketio.Client()

sio.connect(
    "https://synaptask.space",
    headers={"Authorization": "Bearer <api_token>"},
    transports=["websocket"]
)
```

## Rate Limits
- **Per IP:** `10 / 60s` (bucketed).
- **Per User (connect attempts):** `20 / 60s`.
- **Concurrent connections per user:** `10`.

## Origin Policy (Web only)
- **Prod:** only `synaptask.space` is allowed.

## Server → Client Events
### Event: "connected"
```json
{
  "ok": true,
  "uid": "uuid", // user id (RFC 4122 UUID v4 string)
  "client": "web|api",
  "serverTime": "2025-09-13T10:00:00Z" // RFC 3339 / UTC
}
```

### `graph:diff` (broadcasting event)
This event broadcasts any changes in nodes and links accessible to the client.
Partial node or link objects may be sent; only changed fields are guaranteed.
```json
{
  "nodes": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "status": 2,
      "dueDate": "2025-09-13T10:00:00Z",
      "tags": ["backend", "urgent"],
      "priority": 5,
      "dependant": true,
      "volume": 5,
      "assignee": [],
      "lastEditedTime": "2025-09-13T10:00:00Z",
      "version": 3,
      "shareRoots": ["uuid1", "uuid2"]
    },
    { 
      "id": "uuid",
      "status": 2
    }
  ],
  "links": [
    {
      "id": "uuid",
      "type": 0,
      "wasBlocker": true,
      "version": 7
    }
  ]
}
```

## Client → Server
On successful connect, the server emits `connected`. No graph data is sent automatically — clients must request it explicitly via `graph:get`.

## Security Notes
- Dual throttling (IP & user) + cap on concurrent session ids per user.
- No payload is pushed on connect for API clients.

## Error Codes
- Connection rejected (rate limit): client receives a `disconnect` event with reason `"io server disconnect"` (should retry with backoff).
- Connection rejected (origin/auth): same as above; log contains reason on server.
- Unauthorized: before disconnect, server emits:
```json
{"ok": false, "error": "forbidden.auth_missing", "message": "Authentication required"}
```

See also: [graph:get](../ws/get_graph.md).