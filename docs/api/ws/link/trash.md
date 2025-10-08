---

title: link:trash
slug: /api/ws/link/trash
---

Move a link into the trash (soft delete) via WebSocket. Equivalent to [POST /api/link/trash](/api/rest/link/trash) in REST.

## Behavior

* Trashing a link marks it as **inactive** but keeps its history for possible restore.
* Caller must be **owner** of link <u>or</u> have at least **editor** access on target node and at least **viewer** access on source node.
* History batch records the operation and any cascade effects (e.g., if removal of a blocking link unblocks nodes).

## Rate Limits

* `30 / 10s` per user.

### Client → Server (`link:trash`)
Request to move an existing link into the trash.
```json
{
  "id": "uuid"
}
```

* `id` — ID of the link to be trashed (string, required)

#### Success (ack)

```json
{
  "ok": true,
  "diff": {
    "batchId": "uuid-of-history-batch",
    "actor": {
      "username": "alice",
      "email": "alice@example.com"
    },
    "ts": "2025-09-25T10:15:00Z",

    "links": [
      {
        "op": 12,               // History operation type LINK_TRASH=12
        "before": {
          "id": "uuid",
          "inTrash": false,
          "type": 0,
          "version": 3
        },
        "after": {
          "id": "uuid",
          "inTrash": true,
          "version": 4,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-25T10:15:00Z"
        }
      }
    ],
    "nodes": [ // Side effects
      {
        "op": 2,            // NODE_STATUS=2
        "before": {
          "id": "uuid",
          "status": 2,      // Blocked=2
          "version": 5
        },
        "after": {
          "id": "uuid",
          "status": 1,      // Available=1
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

* `links` — the trashed link(s).
* `nodes` — may include affected nodes if cascade effects apply (e.g., target unblocked).

### Broadcasting (`graph:diff`)

> This event is sent to other clients in the ACL room. The own client receives the ACK directly and is excluded for this event.

#### Error (ack)

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

## Example (JavaScript)

```js
// Trash a link
socket.emit("link:trash", { id: "123" }, (ack) => {
  if (ack.ok) {
    console.log("Link trashed:", ack.diff.links);
  } else {
    console.error("Link trash failed:", ack.error, ack.message);
  }
});

// Listen for broadcasts
socket.on("graph:diff", (diff) => {
  console.log("Graph updated:", diff);
});
```

## Example (Python)

```python
import socketio

API_URL = "https://synaptask.space"
API_TOKEN = "<YOUR_API_TOKEN>"

sio = socketio.Client()

@sio.event
def connect():
    print("connected:", sio.sid)
    sio.emit("link:trash", {"id": "123"}, callback=on_ack)


def on_ack(ack):
    if ack.get("ok"):
        print("Link trashed:", ack["diff"]["links"])
    else:
        print("Link trash failed:", ack["error"], ack.get("message"))
    sio.disconnect()

sio.connect(API_URL, auth={"api_token": API_TOKEN}, transports=["websocket"])
sio.wait()
```

See also [Link concept](../../../concepts/links.md) and [Trash concept](../../../concepts/trash.md)