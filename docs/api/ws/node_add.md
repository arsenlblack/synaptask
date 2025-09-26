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
  >
  :::info
  You can create a **stand-alone node** (without specifying `target`)  
  and later attach it to a read-only branch using [`POST /api/link`](./link_add).  

  In this case:  
  - `"source"` → your new node’s `id`,  
  - `"target"` → the read-only node’s `id`,  
  - `"type": 1` → secondary link (keeps your graph consistent without changing branch ACLs).  

  This way, **you remain the owner** of the new node, while still preserving graph consistency and task dependencies.
  :::
* If no `target` is provided, node is created **stand-alone** under the caller’s ownership.
* A primary link (type=0) is created if the parent is `dependant=true`, otherwise a secondary link (type=1).
* History batch records node creation, the link (if any) and all side effects like blocking parent (if any).

### Client → Server `node:add`
```json
{
  "target": "<uuid>",     // optional parent node id
  "title": "string",
  "description": "string",
  "status": 0,
  "dueDate": "2025-09-13T10:00:00Z",
  "tags": ["backend", "urgent"],
  "priority": 5,
  "dependant": true,
  "volume": 5,
  "assignee": ["user1", "user2"],
  "pinned": false,
  "collapsed": false
}
```

### Success (ack)

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
        "tags": ["backend", "urgent"],
        "priority": 5,
        "dependant": true,
        "volume": 5,
        "assignee": [],
        "pinned": false,
        "collapsed": false,
        "createdTime": "2025-09-13T10:00:00Z",
        "lastEditedTime": "2025-09-13T10:00:00Z",
        "version": 0,
        "shareRoots": ["uuid1", "uuid2"]
      },
      { // blocked target (parent node / supertask)
        "id": "uuid",
        "status": 2,  // Partial snapshot: includes only fields changed as a result of the operation
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
The diff includes the newly created node (with all props). Existing nodes that were affected are also included with minimal snapshots (only changed fields).
Existing nodes that were modified as a side effect (e.g., a parent being blocked) are also included, but only with the updated fields.
Each diff may include existing nodes with partial updates (only changed fields). Consumers must merge by id+version, not overwrite blindly.
:::

### Broadcasting (`graph:diff`)
> This event is sent to other clients in the ACL room. The own client receives the ACK directly and is excluded for this event.

### Error (ack)

```json
{
  "ok": false,
  "error": "bad_request" | "forbidden" | "internal.exception",
  "message": "<optional human-readable>"
}
```
| Error                    | Meaning                          |
| ------------------------ | -------------------------------- |
| `bad_request`            | Invalid payload                  |
| `forbidden.auth_missing` | No token/auth header             |
| `forbidden`              | ACL denied                       |
| `not_found`              | Target node doesn’t exist        |
| `conflict`               | Duplicate ID or version conflict |
| `rate_limited`           | Too many requests                |
| `internal.exception`     | Unexpected server failure        |
:::info
Each error can be specified by code (`namespace.reason`).
:::
## Examples

### JavaScript

```js
socket.emit("node:add", payload, (resp) => {
  if (resp.ok) {
    console.log("Node created", resp.diff);
  } else {
    console.error("Node creation failed", resp.error);
  }
});
```

### Python (socketio-client)

```python
import socketio
sio = socketio.Client()

sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <API_TOKEN>"})
resp = sio.call("node:add", {"title": "Write WS docs", "priority": 3}, timeout=5)
if resp.get("ok"):
    print("Node created:", resp["diff"])
else:
    print("Failed:", resp["error"])

```
