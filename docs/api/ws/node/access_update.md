---
title: node:access:update
slug: /api/ws/node/access_update
---

Update an existing access via WebSocket event. Equivalent to [PUT /api/node/access](/api/rest/node/access_update) in REST.

## Behavior

* The caller must have at least **admin** permission on the node.
* Cannot update access for users who are not already shared.
* Only the specified fields are updated.

### Client → Server `node:access:update`
```json
{
  "id": "<uuid>",                    // required, node ID
  "email": "user@example.com",       // required
  "level": 1,                        // optional, default keeps old level
  "due": null,                       // optional expiration update, `null` is foreva
  "branch": true                     // optional, default keeps old value
}
```

### Success (ack)
```json
{
  "ok": true,
  "diff": {
    "access": [
      {
        "op": 21,                       // GRANT_UPDATE=21
        "before": {
          "email": "user@example.com",
          "level": 2,                   // Editor
          "due": "2025-12-01T12:00:00Z",
          "branch": false,
          "version": 1
        },
        "after": {
          "email": "user@example.com",
          "level": 1,                    // Admin
          "due": null,                   // Foreva
          "branch": true,
          "version": 2
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
  "error": "bad_request" | "forbidden" | "not_shared" | "invalid_due",
  "trace_id": "abc123def456"
}
```
**Errors:** see **[error codes](/api/error-codes)**

## Examples

### Python
```py
import socketio

sio = socketio.Client()
sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <YOUR_API_TOKEN>"})

resp = sio.call("node:access:update", {
    "id": "uuid-node-id",
    "email": "user@example.com",
    "level": 1,
    "due": "2025-12-01T12:00:00Z"
}, timeout=5)

if resp.get("ok"):
    print("Access updated:", resp["diff"])
else:
    print("Error:", resp)
```

### JavaScript
```js
socket.emit("node:access:update", {
  id: "uuid-node-id",
  email: "user@example.com",
  level: 1,
  due: "2025-12-01T12:00:00Z"
}, (resp) => {
  if (resp.ok) console.log("Access updated:", resp.diff);
  else console.error("Update failed:", resp.error);
});
```

See also [Node concept](../../../concepts/nodes.md) and [History concept](../../../concepts/history.md)