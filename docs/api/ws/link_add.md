---

title: link:add
slug: /api/ws/link_add
---

Create a link between two nodes via WebSocket.

## Behavior

* A link represents a dependency between nodes.
* `type`:
  * `0` → primary link (blocking): source blocks target.
  * `1` → secondary link (non-blocking).
* ACL:
  * For **secondary links**, caller must have at least **editor** access to source and **viewer** access to target.
  * For **primary links**, caller must must have at least **editor** access on both.
* History batch records link creation and all side effects (e.g., cascading blocking of ancestors).

## Rate Limits
* `5 / 10s` per user.

### Client → Server (`link:add`)
Request to create a link between nodes.
```json
{
  "source": "uuid",
  "target": "uuid",
  "type": 0
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
    "links": [
      {
        "id": "uuid",
        "source": "nodeId",
        "target": "nodeId",
        "type": 0,
        "wasBlocker": true,
        "version": 0
      }
    ],
    "nodes": [
      {
        "id": "uuid",
        "status": 2,
        "version": 5
      }
    ]
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
| Error Code                    | Meaning                                 |
| ---------------------------- | --------------------------------------- |
| `bad_request.invalid_uuid`   | Source/target is not a valid UUID       |
| `bad_request.missing_params` | Source or target missing                |
| `forbidden.auth_missing`     | No token/auth provided                  |
| `forbidden`                  | ACL denied                              |
| `not_found`                  | Source or target node does not exist    |
| `conflict`                   | Duplicate ID or version conflict        |
| `rate_limited`               | Too many requests (rate limit exceeded) |
| `internal.exception`         | Unexpected server error                 |
:::info
Each error can be specified by code (`namespace.reason`).
:::
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

See also: [REST /api/link](../rest/add_link.md).
