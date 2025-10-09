---
title: trash:page
slug: /api/ws/get_trash
---

Retrieve a paginated slice of the authenticated user’s Trash over WebSocket.  
Equivalent to [GET /api/trash](/api/rest/get_trash) in REST.

#### Rate limits
* Maximum **5 requests per 10 seconds per user**.  

### Client → Server `trash:page`
Request a batch of trashed nodes and links.

```json
{
  "limit": 100,
  "offset": 0
}
```

#### Parameters:
* `limit` *(integer, optional)* — number of items per page.  
  * default = `100`
  * min = `1`
  * max = `1000`
* `offset` *(integer, optional)* — offset for pagination.  
  * default = `0`
  * min = `0`

#### Success (ack)
```json
{
  "ok": true,
  "hasMore": true,
  "trace_id": "c7a81f04b921",
  "nodes": [
    {
      "id": "uuid",
      "title": "Archived draft",
      "status": 0,
      "inTrash": true,
      "lastBatchID": "2dfce0ab-fc2b-4a3d-9ecb-b66dc45f9d7a",
      "version": 3,
      "lastEditedTime": "2025-10-02T11:00:00Z",
      "ownerUsername": "BLACK",
      "ownerEmail": "black@synaptask.space"
    }
  ],
  "links": [
    {
      "id": "uuid",
      "source": "uuid-source",
      "target": "uuid-target",
      "type": 0,
      "version": 1,
      "inTrash": true,
      "lastBatchID": "2dfce0ab-fc2b-4a3d-9ecb-b66dc45f9d7a"
    }
  ]
}
```

#### Field reference
* `inTrash` *(bool)* — always `true` for these entries.  
* `lastBatchID` *(uuid)* — identifier of the batch that moved these items to Trash.  
  Items with the same `lastBatchID` belong to the same “deletion group”.

#### Error (ack)
```json
{
  "ok": false,
  "error": "bad_request.out_of_range",
  "message": "limit/offset out of range",
  "trace_id": "c7a81f04b921"
}
```
**Errors:** see **[error codes](/api/error-codes)**

## Example (JavaScript)
```js
const socket = io("https://synaptask.space", {
  transports: ["websocket"],
  extraHeaders: { Authorization: "Bearer <YOUR_API_TOKEN>" }
});

let nodes = [];
let links = [];
let limit = 100;
let offset = 0;

function requestTrash() {
  socket.emit("trash:page", { limit, offset }, (ack) => {
    if (!ack.ok) return console.error("trash:page failed:", ack);

    nodes.push(...(ack.nodes || []));
    links.push(...(ack.links || []));

    console.log(
      `chunk: +${ack.nodes?.length || 0} nodes, +${ack.links?.length || 0} links (offset=${offset}) trace_id=${ack.trace_id}`
    );

    if (ack.hasMore) {
      offset += limit;
      requestTrash();
    } else {
      console.log("Trash fully loaded:", nodes.length, "nodes,", links.length, "links");
    }
  });
}

socket.on("connect", () => {
  console.log("connected:", socket.id);
  requestTrash();
});
```

## Example (Python)
```python
import socketio

SERVER_URL = "https://synaptask.space"
API_TOKEN = "<YOUR_API_TOKEN>"

sio = socketio.Client(logger=False)

nodes, links = [], []
limit, offset = 100, 0

@sio.event
def connect():
    print("connected:", sio.sid)
    request_trash()

def request_trash():
    global offset
    def on_ack(ack):
        global offset
        if not ack.get("ok"):
            print("trash:page error:", ack)
            sio.disconnect()
            return

        nodes.extend(ack.get("nodes", []))
        links.extend(ack.get("links", []))
        print(f"chunk: +{len(ack.get('nodes', []))} nodes, +{len(ack.get('links', []))} links (offset={offset})")

        if ack.get("hasMore"):
            offset += limit
            sio.emit("trash:page", {"limit": limit, "offset": offset}, callback=on_ack)
        else:
            print("done:", len(nodes), "nodes,", len(links), "links")
            sio.disconnect()

    sio.emit("trash:page", {"limit": limit, "offset": offset}, callback=on_ack)

sio.connect(
    SERVER_URL,
    headers={"Authorization": f"Bearer {API_TOKEN}"},
    transports=["websocket"],
)
sio.wait()
```
See also [get:graph](get_graph.md)
