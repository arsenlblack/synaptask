---

title: link:add
slug: /api/ws/link/add
---

Create a link between two nodes via WebSocket. Equivalent to [POST /api/link](/api/rest/link/add) in REST.

## Behavior

* A link represents a dependency between nodes.
* History batch records link creation and all side effects (e.g., cascading blocking of ancestors).
* If same or reversed link are in trash – it will be restored insted of creation new.
* `type`:
  * `1` → secondary link (non-blocking).
  * `0 (default)` → primary link (blocking): source blocks target.  
    Will be automaticly changed to `1` (secondary) if caller has **viewer** or lower access for `target` node.
* `private`:
  * `true` → visible only for owner.
  * `false (default)` → visible for everyone.
  
  Will be automaticly changed according to the ACL rules:
  |   Source⇩\Target⇨   |   Owner   |   Admin   |   Editor  |   Viewer
  | -------------------- | --------- | --------- | --------- | ---------
  |            **Owner** | *provided* | *provided*  | *provided*  | `true`
  |            **Admin** | *provided* | *provided*  | *provided*  | `true`
  |           **Editor** | *provided* | *provided*  | *provided*  | `true`
  |           **Viewer** | *provided* |   `true`    |   `true`    | `true`

## Rate Limits
* `30 / 10s` per user.

### Client → Server (`link:add`)
Request to create a link between nodes.
```json
{
  "source": "uuid",
  "target": "uuid",
  "type": 0,
  "private": false
}
```

* `source` — ID of the source node (string, required)
* `target` — ID of the target node (string, required)
* `type` — integer: `0 = primary` (blocking), `1 = secondary` (optional)

#### Success (ack)

```json
{
  "ok": true,
  "diff": {
    "batchId": "uuid-of-history-batch",     // history batch ID (groups operations)
    "actor": {                              // who performed the action
      "username": "alice",
      "email": "alice@example.com"
    },
    "ts": "2025-09-25T10:15:00Z",           // timestamp in UTC ISO8601

    "links": [
      {
        "op": 10,                            // History operation type LINK_ADD=10
        "before": {},                       // empty for creation
        "after": {
          "id": "uuid",
          "source": "node-uuid-A",
          "target": "node-uuid-B",
          "type": 0,
          "wasBlocker": true,
          "private": true,
          "version": 1,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "createdTime": "2025-09-13T10:00:00Z",
          "lastEditedTime": "2025-09-13T10:00:00Z"
        }
      }
    ],

    "nodes": [
      { // Example: cascade blocking of target
        "op": 2,                            // History operation type NODE_STATUS=2
        "before": {
          "id": "uuid",
          "status": 1,
          "version": 4
        },
        "after": {
          "id": "uuid",
          "status": 2,                      // BLOCKED
          "version": 5,
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

* `links` — the created or updated link(s).
* `nodes` — any nodes affected by cascade blocking (if primary link).

### Broadcasting (`graph:diff`)
> This event is sent to other clients in the ACL room. The own client receives the ACK directly and is excluded for this event.


#### Error (ack)

```json
{
  "ok": false,
  "error": "forbidden" | "internal" | "not_found"
       | "bad_request" | "conflict" | "rate_limited"
  "message": "<optional human-readable>",
  "trace_id": "abcd1234efgh"
}
```
**Errors:** see **[error codes](/api/error-codes)**

## Example (JavaScript)

```js
// Create a primary link between nodes
socket.emit("link:add", { source: "123", target: "456", type: 0 }, (ack) => {
if (ack.ok) {
console.log("Link created:", ack.diff.links);
} else {
console.error("Link creation failed:", ack.error, ack.message);
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
sio.emit("link:add", {"source": "123", "target": "456", "type": 0}, callback=on_link_ack)


def on_link_ack(ack):
if ack.get("ok"):
print("Link created:", ack["diff"]["links"])
else:
print("Link creation failed:", ack["error"], ack.get("message"))
sio.disconnect()


sio.connect(API_URL, auth={"api_token": API_TOKEN}, transports=["websocket"])
sio.wait()
```

See also [Link concept](../../../concepts/links.md) and [Node concept](../../../concepts/nodes.md)