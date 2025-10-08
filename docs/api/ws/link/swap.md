---
title: link:swap
slug: /api/ws/link/swap
---

Swap **source** and **target** of an existing link. Equivalent to [POST /swap](/api/rest/link/swap) in REST.

## Behavior

* Swaps the direction of the link (reverses source and target).
* If caller is not allowed to **edit new target** (ex source) link type will be downgraded to **secondary** `type=1`.
* Side effects: blocks **new target** (ex source) and unbloks **new source** (ex target) if `type=0` **primary**.  

## Rate Limits
* `30 / 10s` per user.

### Client → Server (`link:swap`)
Request to swap a link source and target.
```json
{
  "id": "<uuid>"   // required, link id
}
```

### Success Ack

```json
{
  "ok": true,
  "diff": {
    "batchId": "uuid-of-history-batch",
    "actor": {
      "username": "alice",
      "email": "alice@example.com"
    },
    "ts": "2025-09-25T10:20:00Z",

    "links": [
      {
        "op": 15,             // LINK_SWAP=15
        "before": {
          "id": "uuid",
          "source": "node-uuid-A",
          "target": "node-uuid-B",
          "version": 2
        },
        "after": {
          "id": "uuid",
          "source": "node-uuid-B",
          "target": "node-uuid-A",
          "version": 3,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-25T10:20:00Z"
        }
      }
    ],
    "nodes": [ // Side effects
      {
        "op": 2,                      // History operation type NODE_STATUS=2
        "before": {
          "id": "node-uuid-A",
          "status": 3,                // Completed=3
          "version": 5
        },
        "after": {
          "id": "node-uuid-A",
          "status": 2,                // Blocked=2
          "version": 6,
          "shareRoots": ["root-uuid-1"],
          "lastEditedTime": "2025-09-25T10:15:00Z"
        }
      },
      {
        "op": 2,                      // History operation type NODE_STATUS=2
        "before": {
          "id": "node-uuid-B",
          "status": 2,                // Blocked=2
          "version": 10
        },
        "after": {
          "id": "node-uuid-B",
          "status": 1,                // Available=1
          "version": 11,
          "shareRoots": ["root-uuid-2"],
          "lastEditedTime": "2025-09-25T10:15:00Z"
        }
      }
    ],
    "user": [],
    "access": [],
  }
}
```

### Error Ack

```json
{
  "ok": false,
  "error": "bad_request" | "forbidden" | "not_found" | "conflict" | "internal",
  "message": "<optional>",
  "trace_id": "abcd1234efgh"
}
```
**Errors:** see **[error codes](/api/error-codes)**

### Broadcasting (`graph:diff`)

On success the server broadcasts the resulting diff to:  
* all rooms of the acting user (except the caller’s socket),  
* all relevant ACL branch rooms.

---

## Examples

### JavaScript

```js
socket.emit("link:swap", { id: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6" }, (resp) => {
  if (resp.ok) {
    console.log("Link swapped:", resp.diff);
  } else {
    console.error("Swap failed:", resp.error, resp.message);
  }
});
```

### Python

```python
import socketio

sio = socketio.Client()
sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <API_TOKEN>"})
resp = sio.call("link:swap", {"id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"}, timeout=5)
if resp.get("ok"):
    print("Link swapped:", resp["diff"])
else:
    print("Failed:", resp["error"], resp.get("message"))
```

See also [Link concept](../../../concepts/links.md) and [History concept](../../../concepts/history.md)