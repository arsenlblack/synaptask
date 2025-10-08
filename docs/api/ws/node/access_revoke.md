---
title: node:access:delete
slug: /api/ws/node/access_revoke
---

Revoke (remove) a user's access to a node or branch via WebSocket event. Equivalent to [DELETE /api/node/access](/api/rest/node/access_revoke) in REST.

## Behavior

* The caller must have at least **admin** access to the node.
* Revocation removes the user's permission immediately.
* If no other personal or public access exists, the node becomes private for that user.

### Client → Server `node:access:delete`
```json
{
  "id": "<uuid>",                    // required
  "email": "user@example.com"        // required
}
```

### Success (ack)
```json
{
  "ok": true,
  "diff": {
    "access": [
      {
        "op": 22,                       // GRANT_DELETE=22
        "before": {
          "email": "user@example.com",
          "level": 3,                   // Viewer
          "due": "2025-12-01T12:00:00Z",
          "branch": false,
          "version": 2
        },
        "after": {}
      }
    ],
    "nodes": [],
    "links": [],
    "user": [],
  }
}
```

### Error (ack)
```json
{
  "ok": false,
  "error": "bad_request" | "no_permission" | "user_not_found" | "not_shared",
  "trace_id": "abc123def456"
}
```
**Errors:** see **[error codes](/api/error-codes)**

## Examples

### Python
```py
import socketio

sio = socketio.Client()
sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <API_TOKEN>"})

resp = sio.call("node:access:delete", {
    "id": "uuid-node-id",
    "email": "user@example.com"
}, timeout=5)

if resp.get("ok"):
    print("Access revoked:", resp["diff"])
else:
    print("Failed:", resp["error"])
```

### JavaScript
```js
socket.emit("node:access:delete", {
  id: "uuid-node-id",
  email: "user@example.com"
}, (resp) => {
  if (resp.ok) console.log("Access revoked:", resp.diff);
  else console.error("Revoke failed:", resp.error);
});
```
