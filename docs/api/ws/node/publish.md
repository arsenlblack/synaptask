---
title: node:publish
slug: /api/ws/node/publish
---

Share a node or branch via WebSocket event.  
Equivalent to [POST /api/node/publish](/api/rest/node/publish) in REST.

## Visibility & Permissions

* Publishes a node to make it **publicly accessible (read-only)**.
* If `"branch": true` (default) — all descendant nodes also become part of this public branch.
* If `"branch": false` — only the node itself becomes public.
* Generates a unique `publicToken` which can be used for embedding or anonymous viewing.


### Client → Server `node:publish`

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

:::info
When the node becomes public, all connected clients within that branch receive `"branch:published"` event.
:::

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

## Examples

### JavaScript (socket.io)

```js
socket.emit("node:publish", { id: "<uuid>", branch: true }, (resp) => {
  if (resp.ok) {
    console.log("Published:", resp.diff);
  } else {
    console.error("Publish failed:", resp.error);
  }
});
```

### Python (socketio-client)

```python
import socketio

sio = socketio.Client()
sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <API_TOKEN>"})
resp = sio.call("node:publish", {"id": "<uuid>", "branch": True}, timeout=5)
if resp.get("ok"):
    print("Node published:", resp["diff"])
else:
    print("Failed:", resp["error"])

```

See also [Node concept](../../../concepts/nodes.md) and [Account concept](../../../concepts/account.md)