---
title: graph:get
slug: /guides/share-access
---

Retrieve the graph visible to the authenticated user via WebSocket.


### Client → Server `graph:get`
Request part of the user’s graph over WebSocket.

```json
{
  "limit": 1000,
  "offset": 0
}
```


### Server → Client `graph:init`

#### Success
```json
{
  "hasMore": true,
  "graph": {
    "nodes": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "status": 0,
        "dueDate": "2025-09-13T10:00:00Z",
        "type": 0,
        "tags": "csv",
        "volume": 5,
        "version": 0,
        "asignee": [],
        "createdTime": "2025-09-13T10:00:00Z",
        "lastEditedTime": "2025-09-13T10:00:00Z",
        "ownerUsername": "BLACK",
        "ownerEmail": "mail@synaptask.space",
        "publicToken": "string",
        "x": 0.0,
        "y": 0.0,
        "z": 0.0,
        "pinned": false,
        "collapsed": false,
        "access": 0,     
      }
    ],
    "links": [
      {
        "id": "uuid",
        "source": "nodeId",
        "target": "nodeId",
        "type": 0,
        "version": 0,
        "wasBlocker": false,
      }
    ]
  }
}
```

#### Error `graph:error`
```
{ "error": "internal" }
```

## Rate Limits
- `10 / 10s` per user.

## Example (JavaScript)
```js
// Request first page of graph (1000 items by default)
socket.emit('graph:get', { limit: 1000, offset: 0 });

let allNodes = [];
let allLinks = [];

socket.on('graph:init', (data) => {
  console.log('Received graph chunk:', data);

  // Append received chunk
  allNodes.push(...(data.graph.nodes || []));
  allLinks.push(...(data.graph.links || []));

  // If there are more pages – request next
  if (data.graph.hasMore) {
    const nextOffset = allNodes.length;
    socket.emit('graph:get', { limit: 1000, offset: nextOffset });
  } else {
    console.log('Graph fully loaded');
    console.log('Total nodes:', allNodes.length);
    console.log('Total links:', allLinks.length);
  }
});

socket.on('graph:error', (err) => {
  console.error('Graph request failed:', err);
});
```
## Example (Python)
```python
import socketio

API_URL = "https://synaptask.space"
API_TOKEN = "<YOUR_API_TOKEN>"

sio = socketio.Client(logger=False, engineio_logger=False)

all_nodes, all_links = [], []
limit, offset = 1000, 0

@sio.event
def connect():
    print("connected, sid:", sio.sid)
    # тільки після connect() — перший emit
    sio.emit("graph:get", {"limit": limit, "offset": offset})

@sio.on("graph:init")
def on_graph(data):
    global offset
    graph = data.get("graph", {})
    nodes = graph.get("nodes", [])
    links = graph.get("links", [])

    all_nodes.extend(nodes)
    all_links.extend(links)
    print(f"chunk: +{len(nodes)} nodes, +{len(links)} links (offset={offset})")

    if graph.get("hasMore"):
        offset += limit
        sio.emit("graph:get", {"limit": limit, "offset": offset})
    else:
        print("done:", len(all_nodes), "nodes,", len(all_links), "links")
        sio.disconnect()

@sio.on("graph:error")
def on_graph_error(err):
    print("graph error:", err)
    sio.disconnect()

@sio.event
def connect_error(e):
    print("connect_error:", e)

@sio.event
def disconnect():
    print("disconnected")

# важливо: transports=["websocket"], і токен в auth
sio.connect(API_URL, auth={"api_token": API_TOKEN}, transports=["websocket"], wait_timeout=10)
sio.wait()
```
See also: [REST /api/graph](../rest/get_graph.md).
