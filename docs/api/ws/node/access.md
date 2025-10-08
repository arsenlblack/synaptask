---
title: node:access
slug: /api/ws/node/access
---

Grant personal access to a node/branch. Equivalent to [POST /api/node/access](/api/rest/node/access) in REST.

## Behavior

* The caller must have at least **admin** permission on the node.
* The access level defines user capabilities: `1=Admin`, `2=Editor`, `3=Viewer`. 
* Optionally, a `due` timestamp can set expiration.
* The `branch` flag controls whether access applies to the entire branch.

### Client → Server `node:access`
```json
{
  "id": "<uuid>",                    // required
  "email": "user@example.com",       // required
  "level": 2,                        // optional, default=3 (Viewer)
  "due": "2025-12-01T12:00:00Z",     // optional expiration
  "branch": true                     // optional, default=true
}
```

### Success (ack)
```json
{
  "ok": true,
  "diff": {
    "access": [
      {
        "op": 20,                 // GRANT_UPSERT=20
        "before": {},
        "after": {
          "email": "user@example.com",
          "level": 2,             // Editor
          "due": "2025-12-01T12:00:00Z",
          "branch": true,
          "version": 0
        }
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
  "error": "bad_request" | "no_permission" | "user_not_found" | "conflict",
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

payload = {
    "id": "uuid-node-id",
    "email": "user@example.com",
    "level": 2,
    "branch": True
}

resp = sio.call("node:access", payload, timeout=5)
if resp.get("ok"):
    print("Access granted:", resp["diff"])
else:
    print("Failed:", resp["error"])

```

### JavaScript
```js
socket.emit("node:access", {
  id: "uuid-node-id",
  email: "user@example.com",
  level: 2
}, (resp) => {
  if (resp.ok) console.log("Access granted:", resp.diff);
  else console.error("Grant failed:", resp.error);
});
```

See also [Node concept](../../../concepts/nodes.md) and [History concept](../../../concepts/history.md)