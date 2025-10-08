---
title: node:publish:update
slug: /api/ws/node/publish_update
---

Update expiration date or branch mode of a public node or branch.  
Equivalent to [PUT /api/node/public](/api/rest/node/publish_update) in REST.

## Behavior

* Caller must have at least **admin** access of the node.
* Node must already be **public**.
* Changing `branch` toggles whether the entire branch or only the node is visible.
* Updating `due` sets or extends expiration time. `null=foreva` 😁 

---

### Client → Server `node:publish:update`

```json
{
  "id": "<uuid>",                // required
  "due": "2025-11-01T12:00:00Z", // optional expiration
  "branch": true,                // optional (default=true)
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
    "ts": "2025-10-04T18:00:00Z",
    "nodes": [ // if userId omitted
      {
        "op": 6,          // NODE_PUBLISH=6
        "before": {
          "id": "node-id",
          "publicToken": null
        },
        "after": {
          "id": "node-id",
          "publicToken": "xyz123abc",
          "publicBranch": true,
          "publicDue": "2025-11-01T12:00:00Z",
          "version": 5
        }
      }
    ],
    "links": [],
    "user": [],
    "access": [],
  }
}
```

### Broadcasting (`graph:diff`)

> On success the server broadcasts `graph:diff` to all other users in affected branches.  
> The origin client receives the ACK directly.

---

### Error (ack)

```json
{
  "ok": false,
  "error": "forbidden" | "invalid_due" | "no_permission" | "internal.exception",
  "trace_id": "abc123def456"
}
```

**Errors:** see **[error codes](/api/error-codes)**

---

### Example (JavaScript)

```js
socket.emit("node:publish:update", {
  id: "uuid-node-id",
  due: "2025-12-01T10:00:00Z",
  branch: false
}, (resp) => {
  if (resp.ok) console.log("Public node updated", resp.diff);
  else console.error("Failed", resp.error);
});
```

---

### Example (Python)

```python
import socketio
sio = socketio.Client()


sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <API_TOKEN>"})
resp = sio.call("node:publish:update", {"id": "uuid", "due": "2025-12-01T10:00:00Z"}, timeout=5)
if resp.get("ok"):
    print("Updated public node:", resp["diff"])
else:
    print("Failed:", resp["error"])
```

See also [Node concept](../../../concepts/nodes.md) and [Account concept](../../../concepts/account.md)