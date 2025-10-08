---
title: link:update
slug: /api/ws/link/update
---

Update an existing link via WebSocket. Equivalent to [PUT /api/link](/api/rest/link/update) in REST.

## Behavior

* Allows changing attributes of a link (currently only `type` is updatable).
* History batch records link update and any cascade effects (e.g., unblocking or re-blocking nodes).
* `type`:
  * `1` → secondary link (non-blocking).
  * `0 (default)` → primary link (blocking): source blocks target.  
    Not allowed:
    * If target node `dependent=false`.
    * If caller has **viewer** or lower access for `target` node.
* `private`:
  * `true` → visible only for owner.
  * `false` → visible for everyone.
  
  Changing allowed according to the ACL rules:
  | Source⇩\Target⇨|   Owner |    Admin    |    Editor   |   Viewer
  | --------------- | ------- | ----------- | ----------- | ---------
  |  **Owner**      | allowed |   allowed   |   allowed   | *forbidden*
  |  **Admin**      | allowed |   allowed   |   allowed   | *forbidden*
  |  **Editor**     | allowed |   allowed   |   allowed   | *forbidden*
  |  **Viewer**     | allowed | *forbidden* | *forbidden* | *forbidden*

## Rate Limits
* `30 / 10s` per user.

### Client → Server (`link:update`)
Request to update a link.
```json
{
  "id": "uuid",
  "type": 1,
  "private": false
}
```

* `id` — ID of the link to update (string, required).
* `type` — integer: `0 = primary`, `1 = secondary` (optional, defaults to unchanged).

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
        "op": 11,                           // History operation type LINK_UPDATE=11
        "before": {
          "id": "uuid",
          "type": 0,
          "private": false,
          "version": 2
        },
        "after": {
          "id": "uuid",
          "type": 1,
          "private": true,
          "version": 3,
          "shareRoots": ["root-uuid-1"],
          "lastEditedTime": "2025-09-25T10:15:00Z"
        }
      }
    ],

    "nodes": [
      { // Example: cascade unblock
        "op": 2,                           // History operation type NODE_STATUS=2
        "before": {
          "id": "uuid",
          "status": 2,                     // Blocked=2
          "version": 5
        },
        "after": {
          "id": "uuid",
          "status": 1,                     // Available=1
          "version": 6,
          "shareRoots": ["root-uuid-1"],
          "lastEditedTime": "2025-09-25T10:15:00Z"
        }
      }
    ],
    "user": [],
    "access": [],
  }
}
```

* `links` — the updated link(s).
* `nodes` — any nodes affected by cascade effects.

### Broadcasting (`graph:diff`)
> This event is sent to other clients in the ACL room.  
> The own client receives the ACK directly and is excluded for this event.

#### Error (ack)

```json
{
  "ok": false,
  "error": "bad_request" | "forbidden" | "not_found"
       | "conflict" | "rate_limited" | "internal.exception",
  "message": "<optional human-readable>",
  "trace_id": "abcd1234efgh"
}
```

**Errors:** see **[error codes](/api/error-codes)**

## Example (JavaScript)

```js
// Update link type to secondary
socket.emit("link:update", { id: "link-uuid", type: 1 }, (ack) => {
  if (ack.ok) {
    console.log("Link updated:", ack.diff.links);
  } else {
    console.error("Link update failed:", ack.error, ack.message);
  }
});

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
    sio.emit("link:update", {"id": "link-uuid", "type": 1}, callback=on_ack)

def on_ack(ack):
    if ack.get("ok"):
        print("Link updated:", ack["diff"]["links"])
    else:
        print("Update failed:", ack["error"], ack.get("message"))
    sio.disconnect()

sio.connect(API_URL, auth={"api_token": API_TOKEN}, transports=["websocket"])
sio.wait()
```

See also [Link concept](../../../concepts/links.md) and [History concept](../../../concepts/history.md)