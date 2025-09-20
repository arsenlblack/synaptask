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

### Client → Server `link:add`

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

### Server → Client `link:added`

#### Success

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

#### Error `link:add:error`

```json
{
  "ok": false,
  "error": "forbidden" | "internal" | "not_found"
       | "bad_request" | "conflict" | "rate_limited"
  "message": "<optional human-readable>"
}
```

## Rate Limits

* `5 / 10s` per user.

## Example (JavaScript)

```js
// Create a primary link between nodes
socket.emit('link:add', { source: "123", target: "456", type: 0 });

socket.on('link:added', (data) => {
  console.log('Link created:', data.links);
});

socket.on('link:add:error', (err) => {
  console.error('Link creation failed:', err);
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
    print("connected, sid:", sio.sid)
    sio.emit("link:add", {"source": "123", "target": "456", "type": 0})

@sio.on("link:added")
def on_link_added(data):
    print("Link created:", data)
    sio.disconnect()

@sio.on("link:add:error")
def on_link_error(err):
    print("link error:", err)
    sio.disconnect()

sio.connect(API_URL, auth={"api_token": API_TOKEN}, transports=["websocket"])
sio.wait()
```

See also: [REST /api/link](../rest/add_link.md).
