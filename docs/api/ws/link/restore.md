---
title: link:restore
slug: /api/ws/link/restore
---

Restore a link from the trash (soft-deleted state) via WebSocket. Equivalent to [POST /api/link/restore](/api/rest/link/restore) in REST.

## Behavior

* Restoring a link sets `inTrash=false`.
* Caller must be **owner** of the link <u>or</u> have at least **editor** access on target node and at least **viewer** access on source node.
* History batch records the restore operation and any cascade effects.

## Rate Limits

* `30 / 10s` per user.

---

### Client → Server (`link:restore`)

```json
{
  "id": "uuid"   // required, link id
}
```

---

### Success (ack)

```json
{
  "ok": true,
  "diff": {
    "batchId": "uuid-of-history-batch",
    "actor": {
      "username": "alice",
      "email": "alice@example.com"
    },
    "ts": "2025-09-25T11:00:00Z",

    "links": [
      {
        "op": 13,               // LINK_RESTORE=13
        "before": {
          "id": "uuid",
          "inTrash": true,
          "type": 0,
          "version": 4
        },
        "after": {
          "id": "uuid",
          "inTrash": false,
          "version": 5,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-25T11:00:00Z"
        }
      }
    ],
    "nodes": [ // Side effects
      {
        "op": 2,            // NODE_STATUS=2
        "before": {
          "id": "uuid",
          "status": 1,      // Available=1
          "version": 5
        },
        "after": {
          "id": "uuid",
          "status": 2,      // Blocked=2
          "version": 6,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-25T10:15:00Z"
        }
      }
    ],
    "user": [],
    "access": [],
  }
}
```

* `links` — the restored link(s).
* `nodes` — may include affected nodes if cascade effects apply.

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
  "error": "forbidden" | "internal" | "not_found"
       | "bad_request" | "conflict" | "rate_limited",
  "message": "<optional human-readable>",
  "trace_id": "abcd1234efgh"
}
```

**Errors:** see **[error codes](/api/error-codes)**

---

## Example (JavaScript)

```js
socket.emit("link:restore", { id: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6" }, (resp) => {
  if (resp.ok) {
    console.log("Link restored:", resp.diff);
  } else {
    console.error("Restore failed:", resp.error, resp.message);
  }
});
```

## Example (Python)

```python
import socketio
sio = socketio.Client()

sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <API_TOKEN>"})
resp = sio.call("link:restore", {"id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"}, timeout=5)
if resp.get("ok"):
    print("Link restored:", resp["diff"])
else:
    print("Failed:", resp["error"], resp.get("message"))
```

See also [Link concept](../../../concepts/links.md) and [Trash concept](../../../concepts/trash.md)