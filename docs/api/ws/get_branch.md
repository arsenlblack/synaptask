---

title: branch:get
slug: /api/ws/get_branch
---

Retrieve a branch (subgraph) for the authenticated user over WebSocket. Equivalent to [GET /api/branch](/api/rest/get_branch) in REST.

#### Behavior

* If `root` is a valid UUID → return private/shared branch visible to the caller.
* If `root` is a public token → return public branch.
  * If that node has `PublicBranch = false`, only the root node is returned.

#### Rate limits

* Maximum **5 requests per 10 seconds per user**.

### Client → Server `branch:get`

Request a branch by root UUID or public token.

```json
{
  "root": "<uuid-or-token>",
  "limit": 1000,
  "offset": 0
}
```

### Parameters:

| Name     | Type                   | Required | Description                                                     |
| -------- | ---------------------- | -------- | --------------------------------------------------------------- |
| `root`   | string (uuid or token) | ✅       | Root node of the branch.                                        |
| `limit`  | integer                | optional | Max number of objects in the response (default 1000, max 5000). |
| `offset` | integer                | optional | Pagination offset (default 0).                                  |

#### Success (ack)

```json
{
  "ok": true,
  "nodes": [...],
  "links": [...],
  "hasMore": false,
  "trace_id": "f3a12bc9e1d4"
}
```

#### Error (ack)

```json
{
  "ok": false,
  "error": "bad_request.out_of_range",
  "message": "limit/offset out of range",
  "trace_id": "f3a12bc9e1d4"
}
```

**Errors:** see [error codes](/api/error-codes)

## Example (JavaScript)

```js
let allNodes = [];
let allLinks = [];
let limit = 1000;
let offset = 0;

const socket = io("https://synaptask.space", {
  transports: ["websocket"],
  extraHeaders: {
    Authorization: "Bearer <YOUR_API_TOKEN>",
  },
});

function requestBranch(root) {
  socket.emit("branch:get", { root, limit, offset }, (ack) => {
    if (!ack.ok) {
      console.error("branch:get failed:", ack);
      return;
    }

    const nodes = ack.nodes || [];
    const links = ack.links || [];

    allNodes.push(...nodes);
    allLinks.push(...links);

    console.log(`chunk: +${nodes.length} nodes (offset=${offset}) trace_id=${ack.trace_id}`);

    if (ack.hasMore) {
      offset += limit;
      requestBranch(root);
    } else {
      console.log("Branch fully loaded");
      console.log("Total nodes:", allNodes.length);
    }
  });
}

socket.on("connect", () => {
  console.log("connected:", socket.id);
  requestBranch("<UUID_OR_TOKEN>");
});
```

## Example (Python)

```python
import socketio

SERVER_URL = "https://synaptask.space"
API_TOKEN = "<YOUR_API_TOKEN>"
ROOT = "<UUID_OR_TOKEN>"

sio = socketio.Client(logger=False, engineio_logger=False)

all_nodes, all_links = [], []
limit, offset = 1000, 0

@sio.event
def connect():
    print("connected, sid:", sio.sid)
    request_branch()

def request_branch():
    global offset

    def on_ack(ack):
        global offset
        if not ack.get("ok"):
            print("branch:get error:", ack)
            sio.disconnect()
            return

        nodes = ack.get("nodes", [])
        links = ack.get("links", [])

        all_nodes.extend(nodes)
        all_links.extend(links)
        print(f"chunk: +{len(nodes)} nodes (offset={offset})")

        if ack.get("hasMore"):
            offset += limit
            sio.emit("branch:get", {"root": ROOT, "limit": limit, "offset": offset}, callback=on_ack)
        else:
            print("done:", len(all_nodes), "nodes")
            sio.disconnect()

    sio.emit("branch:get", {"root": ROOT, "limit": limit, "offset": offset}, callback=on_ack)

@sio.event
def disconnect():
    print("disconnected")

sio.connect(
    SERVER_URL,
    headers={"Authorization": f"Bearer {API_TOKEN}"},
    transports=["websocket"],
    wait_timeout=10,
)
sio.wait()
```
