---

title: node:unpublish
slug: /api/ws/node/unpublish
---

Unpublish a node or branch via WebSocket.  
Reversed operation to [node:publish](/api/ws/node/publish).  
Equivalent to [DELETE /api/node/public](/api/rest/node/unpublish).

---

## Overview

Publishing a node creates a public link accessible to anyone with its `PublicToken`.
This operation also notifies all currently connected clients who have access to the affected branches.

---

## Behavior

* Removes the node’s `PublicToken` and `PublicDue` fields.
* ACL:
  * Caller must have at least **admin** access.

---

### Client → Server: `node:unpublish`

```json
{
  "id": "<uuid>"   // required
}
```

### Success Ack

```json
{
  "ok": true,
  "diff": {
    "batchId": "uuid",
    "actor": {
      "username": "john_doe",
      "email": "john@example.com"
    },
    "ts": "2025-10-04T10:00:00Z",

    "nodes": [
      {
        "op": 6,   // NODE_PUBLISH=6
        "before": {
          "id": "uuid",
          "publicToken": "abcd1234xyz",
          "publicDue": "2025-12-01T00:00:00Z",
          "version": 4
        },
        "after": {
          "id": "uuid",
          "publicToken": null,
          "publicDue": null,
          "version": 5,
          "lastEditedTime": "2025-10-04T10:00:00Z"
        }
      }
    ]
  }
}
```

---

### Error Ack

```json
{
  "ok": false,
  "error": "not_public" | "no_permission" | "internal.exception",
  "trace_id": "xyz987def123"
}
```

**Errors:** see **[error codes](/api/error-codes)**

---

## Example (JavaScript)

```js
socket.emit("node:unpublish", { id: "<uuid>" }, (resp) => {
  if (resp.ok) {
    console.log("Node unpublished:", resp.diff);
  } else {
    console.error("Unpublish failed:", resp.error);
  }
});
```

---

## Example (Python via `python-socketio`)

```python
import socketio

sio = socketio.Client()
sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <API_TOKEN>"})

resp = sio.call("node:unpublish", {"id": "<uuid>"}, timeout=5)
if resp.get("ok"):
    print("Node unpublished:", resp["diff"])
else:
    print("Unpublish failed:", resp["error"])
```

## Notes for Integrators

* After unpublishing, any previously shared public URL becomes invalid.
* Attempting to access it will result in a `404 Not Found` or equivalent socket rejection.

See also [Node concept](../../../concepts/nodes.md) and [History concept](../../../concepts/history.md)