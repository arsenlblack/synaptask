---

title: node:add
slug: /api/ws/node_add
---

Create a new node via WebSocket event. Equivalent to `POST /api/node` in REST.

## Visibility & Permissions

* Requires **authenticated user** (`socket_auth_required`).
* If a `target` (parent node) is provided:
  * User must have **editor** access on the parent.
  * New node **inherits** the owner and ACL from the parent node.
  * `viewer` or `no access` → `forbidden` error.
  :::info
  You can create a **stand-alone node** (without specifying `target`)  
  and later attach it to a read-only branch using [`POST /api/link`](./link_add).  

  In this case:  
  - `"source"` → your new node’s `id`,  
  - `"target"` → the read-only node’s `id`,  
  - `"type": 1` → secondary link (keeps your graph consistent without changing branch ACLs).  

  This way, **you remain the owner** of the new node, while still preserving graph consistency and task dependencies.
  :::
* If no `target` is provided, node is created **standalone** under the caller’s ownership.
* A primary link (type=0) is created if the parent is `dependant=true`, otherwise a secondary link (type=1).
* History batch records node creation, the link (if any) and all side effects like blocking parent (if any).

## Socket.IO Event

**Client → Server:** `node:add`
**Server → Client (success):** `node:added`
**Server → Client (error):** `node:add:error`

### Request Payload

```json
{
  "target": "<uuid>",          // optional parent node id
  "props": {
    "title": "string",
    "description": "string",
    "status": 0,
    "dueDate": "2025-09-13T10:00:00Z",
    "tags": "csv",
    "priority": 5,
    "dependant": true,
    "volume": 5,
    "asignee": ["user1", "user2"],
    "pinned": false,
    "collapsed": false
  }
}
```

### Success Response (`node:added`)

```json
{
  "ok": true,
  "diff": {
    "nodes": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "status": 0,
        "dueDate": "2025-09-13T10:00:00Z",
        "tags": "csv",
        "priority": 5,
        "dependant": true,
        "volume": 5,
        "asignee": [],
        "pinned": false,
        "collapsed": false,
        "createdTime": "2025-09-13T10:00:00Z",
        "lastEditedTime": "2025-09-13T10:00:00Z",
        "version": 0
      },
      { // blocket target
        "id": "uuid",
        "status": 2,
      }
    ],
    "links": [
      {
        "id": "uuid",
        "source": "nodeId",
        "target": "nodeId",
        "type": 0,
        "wasBlocker": false,
        "version": 0
      }
    ]
  }
}
```
:::info
The first object in nodes is the newly created node with all its properties.
Existing nodes that were modified as a side effect (e.g., a parent being blocked) are also included, but only with the updated fields.
:::

### Error Response (`node:add:error`)

```json
{
  "ok": false,
  "error": "bad_request" | "forbidden" | "internal" | "not_found" | "rate_limited",
  "message": "<optional human-readable>"
}
```

## Examples

### JavaScript

```js
socket.emit("node:add", {
  target: "123e4567-e89b-12d3-a456-426614174000",
  props: {
    title: "New task",
    priority: 5,
    dependant: true
  }
});

socket.on("node:added", (data) => {
  console.log("Node created:", data);
});

socket.on("node:add:error", (err) => {
  console.error("Node add failed:", err);
});
```

### Python (socketio-client)

```python
import socketio

sio = socketio.Client()

@sio.event
def connect():
    print("Connected")

@sio.on("node:added")
def on_node_added(data):
    print("Node created:", data)

@sio.on("node:add:error")
def on_node_error(err):
    print("Node add failed:", err)

sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <API_TOKEN>"})
sio.emit("node:add", {
    "props": {"title": "Write WS docs", "priority": 3}
})
```
