---
title: node:update
slug: /api/ws/node/update
---

Update fields of an existing node via WebSocket event. Equivalent to [PUT /api/node](/api/rest/node/update) in REST.

## Visibility & Permissions

* Caller must have **editor** access on the node being updated.
* ACL violations result in `forbidden` error.
* Updates are **partial**: only provided fields are modified.  
  Fields omitted in the payload remain unchanged.

### Client → Server `node:update`
```json
{
  "id": "<uuid>",          // required
  "title": "New title",
  "status": 3,
}
```

### Success (ack)

```json
{
  "ok": true,
  "diff": {
    "batchId": "uuid",
    "actor": {
      "username": "alice",
      "email": "alice@example.com"
    },
    "ts": "2025-09-25T10:00:00Z",

    "nodes": [
      {
        "op": 1,               // History operation NODE_UPDATE=1
        "before": {
          "id": "uuid",
          "title": "Old title",
          "version": 4
        },
        "after": {
          "id": "uuid",
          "title": "New title",
          "version": 5,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-25T10:00:00Z"
        }
      },
      {
        "op": 2,               // History operation NODE_STATUS=2; changing status is a special separate operation
        "before": {
          "id": "uuid",
          "status": 1,        // 1=Available
          "version": 5
        },
        "after": {
          "id": "uuid",
          "title": "New title",
          "status": 3,        // 3=Completed
          "version": 6,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-25T10:00:00Z"
        }
      },
      {  // Side effect
        "op": 2,
        "before": {
          "id": "uuid2",
          "status": 2,        // 2=Blocked
          "version": 10
        },
        "after": {
          "id": "uuid2",
          "title": "New title",
          "status": 1,        // 1=Available
          "version": 11,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-25T10:00:00Z"
        }
      }
    ],

    "links": [],
    "user": [],
    "access": [],
  }
}
```
:::info
Changing status is always a separate operation.
:::
:::note
The diff includes only changed fields in `before` and `after`.  
Consumers must merge by `id+version`, not overwrite blindly.  
Side effects (e.g., blocking parent status updates) will also be included with their minimal changes.
:::

### Broadcasting (`graph:diff`)
> On success the server also emits `graph:diff` to all other clients in the ACL rooms.  
> The origin client receives the ACK directly and is excluded from the broadcast.

### Error (ack)

```json
{
  "ok": false,
  "error": "bad_request" | "forbidden" | "not_found" | "conflict" | "internal.exception",
  "message": "<optional human-readable>",
  "trace_id": "abc123def456"
}
```
**Errors:** see **[error codes](/api/error-codes)**

## Examples

### JavaScript

```js
socket.emit("node:update", { id: "<uuid>", title: "Renamed Task" }, (resp) => {
  if (resp.ok) {
    console.log("Node updated", resp.diff);
  } else {
    console.error("Update failed", resp.error);
  }
});
```

### Python (socketio-client)

```python
import socketio
sio = socketio.Client()

sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <API_TOKEN>"})
resp = sio.call("node:update", {"id": "<uuid>", "status": 2}, timeout=5)
if resp.get("ok"):
    print("Node updated:", resp["diff"])
else:
    print("Failed:", resp["error"])
```

See also [Node concept](../../../concepts/nodes.md) and [History concept](../../../concepts/history.md)