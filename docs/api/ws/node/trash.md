---
title: node:trash
slug: /api/ws/node/trash
---

Move a node into the **trash** (soft delete) via WebSocket event. Equivalent to [POST /api/node/trash](/api/rest/node/trash) in REST.

## Visibility & Permissions

* Requires **authenticated user** (`socket_auth_required`).
* User must have **editor** access to the node.  
  - If ACL check fails → `forbidden` error.

---

### Client → Server `node:trash`

```json
{
  "id": "<uuid>"    // required, node id
}
```

---

### Success (ack)

```json
{
  "ok": true,
  "diff": {
    "batchId": "uuid",                // ID of the history batch
    "actor": {
      "username": "alice",
      "email": "alice@example.com"
    },
    "ts": "2025-09-25T10:00:00Z",     // timestamp of the operation

    "nodes": [
      {
        "op": 3,                      // NODE_TRASH=3
        "before": {
          "id": "uuid",
          "inTrash": false,
          "version": 3
        },
        "after": {
          "id": "uuid",
          "inTrash": true,
          "version": 4,
          "lastEditedTime": "2025-09-25T10:00:00Z",
          "shareRoots": ["uuid1", "uuid2"]
        }
      },
      // side effects:
      {
        "op": 2,                      // NODE_STATUS=2
        "before": {
          "id": "uuid2",
          "status": 2,                // Blocked=2
          "version": 7
        },
        "after": {
          "id": "uuid2",
          "status": 1,                // Available=1
          "version": 8,
          "lastEditedTime": "2025-09-25T10:00:00Z",
          "shareRoots": ["uuid1", "uuid2"]
        }
      }
    ],
    // all relative links will be trashed
    "links": [
      {
        "op": 12,                            // History operation type LINK_TRASH=12
        "before": {
          "id": "uuid",
          "inTrash": false,
          "version": 4
        },
        "after": {
          "id": "uuid",
          "version": 4,
          "inTrash": true,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-13T10:00:00Z"
        }
      },
      {  // side effect
        "op": 12,                            // History operation type LINK_TRASH=12
        "before": {
          "id": "uuid2",
          "inTrash": false,
          "version": 8
        },
        "after": {
          "id": "uuid2",
          "inTrash": true,
          "version": 9,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-13T10:00:00Z"
        }
      }
    ],
    "user": [],
    "access": [],
  }
}
```
:::info
The diff contains the updated node (with the new `inTrash` flag)  
and any side effects (e.g., child links trashed, dependencies updated).  
Consumers must merge diffs by `id+version`, not overwrite blindly.
:::

---

### Broadcasting (`graph:diff`)

> On success the server broadcasts `graph:diff` to:
> * the user’s own room (`user:<uid>`) **except the caller**,  
> * all relevant ACL branch rooms.  
> The calling client receives the ACK directly.

---

### Error (ack)

```json
{
  "ok": false,
  "error": "bad_request" | "forbidden" | "not_found" | "conflict" | "internal.exception",
  "message": "<optional human-readable>"
}
```
**Errors:** see **[error codes](/api/error-codes)**

---

## Examples

### JavaScript

```js
socket.emit("node:trash", { id: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6" }, (resp) => {
  if (resp.ok) {
    console.log("Node moved to trash:", resp.diff);
  } else {
    console.error("Trash failed:", resp.error, resp.message);
  }
});
```

### Python (socketio-client)

```python
import socketio
sio = socketio.Client()

sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <API_TOKEN>"})
resp = sio.call("node:trash", {"id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"}, timeout=5)
if resp.get("ok"):
    print("Node moved to trash:", resp["diff"])
else:
    print("Failed:", resp["error"], resp.get("message"))
```

See also [Node concept](../../../concepts/nodes.md) and [Trash concept](../../../concepts/trash.md)