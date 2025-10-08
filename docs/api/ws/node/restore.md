---
title: node:restore
slug: /api/ws/node/restore
---

Restore a node from the **trash** via WebSocket event.  
Equivalent to [POST /api/node/restore](/api/rest/node/restore) in REST.

## Visibility & Permissions

* User must have **editor** access to the node.  
  - If ACL check fails → `forbidden` error.
* Node must already be in **trash**.  
  - If not trashed → `not_trashed_node` error.

---

### Client → Server `node:restore`

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
    "batchId": "uuid",
    "actor": {
      "username": "alice",
      "email": "alice@example.com"
    },
    "ts": "2025-09-25T11:00:00Z",
    "nodes": [
      {
        "op": 4,   // NODE_RESTORE=4
        "before": {
          "id": "uuid",
          "inTrash": true,
          "version": 4
        },
        "after": {
          "id": "uuid",
          "inTrash": false,
          "version": 5,
          "lastEditedTime": "2025-09-25T11:00:00Z",
          "shareRoots": ["uuid1", "uuid2"]
        }
      },
      {  // side effect
        "op": 2,          // NODE_STATUS=2
        "before": {
          "id": "uuid2",
          "Status": 1,                // Node status Available=1
          "version": 4
        },
        "after": {
          "id": "uuid2",
          "Status": 2,                // Node status Blocked=2
          "version": 5,
          "lastEditedTime": "2025-09-25T11:00:00Z",
          "shareRoots": ["uuid1", "uuid2"]
        }
      }
    ],
    "links": [
      {
        "op": 13,                            // History operation type LINK_RESTORE=13
        "before": {
          "id": "uuid",
          "inTrash": true,
          "version": 4
        },
        "after": {
          "id": "uuid",
          "version": 5,
          "inTrash": false,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-13T10:00:00Z"
        }
      },
      {  // side effect
        "op": 13,                            // History operation type LINK_RESTORE=13
        "before": {
          "id": "uuid2",
          "inTrash": true,
          "version": 8
        },
        "after": {
          "id": "uuid2",
          "inTrash": false,
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
The diff contains the restored node and any side effects  
(e.g. links automatically restored when parent node is restored).  
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
socket.emit("node:restore", { id: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6" }, (resp) => {
  if (resp.ok) {
    console.log("Node restored:", resp.diff);
  } else {
    console.error("Restore failed:", resp.error, resp.message);
  }
});
```

### Python (socketio-client)

```python
import socketio
sio = socketio.Client()

sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <API_TOKEN>"})
resp = sio.call("node:restore", {"id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"}, timeout=5)
if resp.get("ok"):
    print("Node restored:", resp["diff"])
else:
    print("Failed:", resp["error"], resp.get("message"))
```

See also [Node concept](../../../concepts/nodes.md) and [Trash concept](../../../concepts/trash.md)