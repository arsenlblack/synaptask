---
title: history:page
slug: /api/ws/history/get
---

Retrieve a paginated list of history batches visible to the authenticated user via WebSocket.  
Equivalent to [GET /api/history](/api/rest/history/get).

#### Rate limits
* Maximum **5 requests per 10 seconds per user**.

### Client → Server `history:page`
```json
{
  "scopeType": "GRAPH",
  "scopeId": "uuid",
  "limit": 100,
  "offset": 0
}
```

#### Parameters:
* `scopeType` *(string, required)* — logical scope (e.g. `"GRAPH"`).  
* `scopeId` *(UUID, required)* — unique scope identifier.  
* `limit` *(integer, optional, default=100, max=1000)* — page size.  
* `offset` *(integer, optional, default=0)* — pagination offset.

---

#### Success (ack)
```json
{
  "ok": true,
  "hasMore": true,
  "trace_id": "c7a81f04b921",
  "batches": [
    {
      "batchId": "b8e0c4cb-8ab7-4b2e-91cd-8fd92e1b9a20",
      "actor": {
        "username": "BLACK",
        "email": "black@synaptask.space"
      },
      "ts": "2025-10-08T10:45:02Z",
      "undone": false,
      "ops": [
        {
          "id": 100123,
          "type": 1,
          "entityId": "d83d2f10-f4c9-49b8-a93b-f8b0f2db1e54",
          "forwardPatch": { "Title": "New title" },
          "inversePatch": { "Title": "Old title" },
          "guard": { "Version": 2 },
          "createdTime": "2025-10-08T10:45:02Z"
        }
      ]
    }
  ]
}
```

#### Error (ack)
```json
{
  "ok": false,
  "error": "bad_request.invalid_scope",
  "message": "Scope not accessible",
  "trace_id": "c7a81f04b921"
}
```

---

### Example (JavaScript)
```js
const socket = io("https://synaptask.space", {
  transports: ["websocket"],
  extraHeaders: { Authorization: "Bearer <YOUR_API_TOKEN>" }
});

function requestHistory(scopeType, scopeId, limit = 100, offset = 0) {
  socket.emit("history:page", { scopeType, scopeId, limit, offset }, (ack) => {
    if (!ack.ok) return console.error("history:page failed:", ack);
    console.log("Received", ack.batches?.length, "batches (offset", offset, ")");
    if (ack.hasMore) requestHistory(scopeType, scopeId, limit, offset + limit);
  });
}

socket.on("connect", () => {
  console.log("connected:", socket.id);
  requestHistory("GRAPH", "<scope-uuid>");
});
```

### Example (Python)
```python
import socketio

SERVER_URL = "https://synaptask.space"
API_TOKEN = "<YOUR_API_TOKEN>"

sio = socketio.Client()

@sio.event
def connect():
    print("connected:", sio.sid)
    sio.emit("history:page", {
        "scopeType": "GRAPH",
        "scopeId": "<scope-uuid>",
        "limit": 100,
        "offset": 0
    }, callback=lambda ack: print("ACK:", ack))

sio.connect(SERVER_URL, headers={"Authorization": f"Bearer {API_TOKEN}"}, transports=["websocket"])
sio.wait()
```

See also [History concepts](../../../concepts/history.md)

