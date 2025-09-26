---
title: graph:get
slug: /api/ws/get_graph
---

Retrieve a paginated slice of the authenticated user’s graph over WebSocket.
#### Rate limits
* Maximum **5 requests per 10 seconds per user**.
* If the limit is exceeded, the server still responds with an ack in the standard error shape:
```json
{
  "ok": false,
  "error": "rate_limited",
  "message": "Too many requests, please slow down",
  "trace_id": "f3a12bc9e1d4"
}
```

### Client → Server `graph:get`
Request part of the user’s graph over WebSocket.

```json
{
  "limit": 1000,
  "offset": 0
}
```
### Parameters:
* `limit` *(integer, optional)* — maximum number of objects in the response.
  * default = `1000`
  * min = `1`
  * max = `5000`
* `offset` *(integer, optional)* — offset for pagination.
  * default = `0`
  * min = `0`

#### Success (ack)
```json
{
  "ok": true,
  "hasMore": true,
  "trace_id": "f3a12bc9e1d4",
  "graph": {
    "nodes": [
      {
        "id": "<uuid>",
        "title": "string",
        "description": "string",
        "status": 0,
        "dueDate": "2025-09-13T10:00:00Z", // ISO-8601 strings with Z suffix
        "type": 0,
        "tags": ["backend", "urgent"],
        "priority": 5,
        "dependant": true,
        "volume": 5,
        "version": 0,
        "assignee": ["user1", "user2"],
        "createdTime": "2025-09-13T10:00:00Z", // ISO-8601 strings with Z suffix
        "lastEditedTime": "2025-09-13T10:00:00Z", // ISO-8601 strings with Z suffix
        "ownerUsername": "BLACK",
        "ownerEmail": "example@synaptask.space",
        "publicToken": "string",
        "x": 0.0,
        "y": 0.0,
        "z": 0.0,
        "pinned": false,
        "collapsed": false,
        "access": 0,
        "shareRoots": ["uuid1", "uuid2"]
      }
    ],
    "links": [
      {
        "id": "<uuid>",
        "source": "<uuid>",
        "target": "<uuid>",
        "type": 0,
        "version": 0,
        "wasBlocker": false
      }
    ]
  }
}
```

### Field reference
#### Node fields
* `status` *(int)*
  * `0` = Available
  * `1` = InProgress
  * `2` = Blocked
  * `3` = Completed
* `type` *(int)* reserved, subject to change.
* `access` *(int)* access level for caller
  * `0` = owner (full rights)
  * `1` = admin
  * `2` = editor
  * `3` = viewer
* `shareRoots` *(array of uuid)* — list of branch root IDs this node belongs to (used for access control and broadcasts).

#### Link fields
* `type` *(int)*
  * `0` = primary (blocking dependency)
  * `1` = secondary (non-blocking dependency)
* `wasBlocker` *(bool)* — indicates whether the link previously represented a blocking dependency.

#### Error (ack)
```json
{
  "ok": false,
  "error": "bad_request.out_of_range",
  "message": "limit/offset out of range",
  "trace_id": "f3a12bc9e1d4"
}
```
## Errors
* Possible error codes returned by the server:
* `bad_request.invalid_number` — `limit` or `offset` is not an integer.
* `bad_request.out_of_range` — `limit` or `offset` is outside allowed bounds.
* `forbidden.auth_missing` — user not authenticated.
* `internal.malformed_response` — unexpected internal error.
* `internal` — generic unexpected failure (server returned `{error: "internal.exception"}` etc.).
All error responses always include a `trace_id` for log correlation.

## Rate Limits
- `Maximum 5 requests per 10 seconds per user.`

## Example (JavaScript)
```js
// Request first page of graph (1000 items by default)
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

function requestGraph() {
  socket.emit("graph:get", { limit, offset }, (ack) => {
    if (!ack.ok) {
      console.error("graph:get failed:", ack);
      return;
    }

    const graph = ack.graph || {};
    const nodes = graph.nodes || [];
    const links = graph.links || [];

    allNodes.push(...nodes);
    allLinks.push(...links);

    console.log(
      `chunk: +${nodes.length} nodes, +${links.length} links (offset=${offset}) trace_id=${ack.trace_id}`
    );

    if (ack.hasMore) {
      offset += limit;
      requestGraph();
    } else {
      console.log("Graph fully loaded");
      console.log("Total nodes:", allNodes.length);
      console.log("Total links:", allLinks.length);
    }
  });
}

socket.on("connect", () => {
  console.log("connected:", socket.id);
  requestGraph();
});

socket.on("disconnect", () => {
  console.log("disconnected");
});
```

## Example (Python)
```python
import socketio

SERVER_URL = "https://synaptask.space"
API_TOKEN = "<YOUR_API_TOKEN>"

sio = socketio.Client(logger=False, engineio_logger=False)

all_nodes, all_links = [], []
limit, offset = 1000, 0


@sio.event
def connect():
    print("connected, sid:", sio.sid)
    request_graph()


def request_graph():
    global offset
    def on_ack(ack):
        global offset
        if not ack.get("ok"):
            print("graph:get error:", ack)
            sio.disconnect()
            return

        graph = ack.get("graph", {})
        nodes = graph.get("nodes", [])
        links = graph.get("links", [])

        all_nodes.extend(nodes)
        all_links.extend(links)
        print(f"chunk: +{len(nodes)} nodes, +{len(links)} links (offset={offset})")

        if ack.get("hasMore"):
            offset += limit
            sio.emit("graph:get", {"limit": limit, "offset": offset}, callback=on_ack)
        else:
            print("done:", len(all_nodes), "nodes,", len(all_links), "links")
            sio.disconnect()

    sio.emit("graph:get", {"limit": limit, "offset": offset}, callback=on_ack)


@sio.event
def connect_error(e):
    print("connect_error:", e)


@sio.event
def disconnect():
    print("disconnected")


# important: provide token in headers
sio.connect(
    SERVER_URL,
    headers={"Authorization": f"Bearer {API_TOKEN}"},
    transports=["websocket"],
    wait_timeout=10,
)
sio.wait()
```
See also: [REST /api/graph](../rest/get_graph.md).
