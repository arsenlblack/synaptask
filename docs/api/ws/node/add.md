---

title: node:add
slug: /api/ws/node/add
---

Create a new node via WebSocket event. Equivalent to [POST /api/node](/api/rest/node/add) in REST.

## Visibility & Permissions

* If a `target` (parent node) is provided:
  * If you have **editor** access on the target: new node will **inherit** the owner and ACL from the parent node.
  * If you have **viewer** or less access on the target: you will be owner of node and link will be downgraded to **secondary** `type=1`.
  * `no access` → `forbidden` error.  
  * A **primary** link `type=0` is created if the parent is `dependent=true`, otherwise link will downgraded **secondary** link `type=1`.
* If no `target` is provided, node is created **stand-alone** under the caller’s ownership.
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
  "dependent": true,
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
    "batchId": "uuid",                // ID of the history batch
    "actor": {
      "username": "alice",
      "email": "alice@example.com"
    },
    "ts": "2025-09-25T10:00:00Z",     // timestamp of the operation

    "nodes": [
      {
        "op": 0,                      // History operation type NODE_ADD=0
        "before": {},
        "after": {
          "id": "uuid",
          "title": "string",
          "description": "string",
          "status": 0,
          "dueDate": "2025-09-13T10:00:00Z",
          "tags": ["backend", "urgent"],
          "priority": 5,
          "dependent": true,
          "volume": 5,
          "assignee": ["user-id"],
          "pinned": false,
          "collapsed": false,
          "createdTime": "2025-09-13T10:00:00Z",
          "lastEditedTime": "2025-09-13T10:00:00Z",
          "version": 0,
          "shareRoots": ["uuid1", "uuid2"]
        }
      },
      {
        "op": 2,                      // History operation type NODE_STATUS=2
        "before": {
          "id": "uuid",
          "status": 1,                // Node status InProgress=1
          "version": 2
        },
        "after": {
          "id": "uuid",
          "status": 2,                // Node status Blocked=2
          "version": 3,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-13T10:00:00Z"
        }
      }
    ],

    "links": [
      {
        "op": 10,                      // History operation type LINK_ADD=10
        "before": {},
        "after": {
          "id": "uuid",
          "source": "nodeId",
          "target": "nodeId",
          "type": 0,
          "wasBlocker": false,
          "version": 0,
          "shareRoots": ["uuid1", "uuid2"],
          "createdTime": "2025-09-13T10:00:00Z",
          "lastEditedTime": "2025-09-13T10:00:00Z"
        }
      }
    ],
    "user": [],
    "access": [],
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
**Errors:** see **[error codes](/api/error-codes)**

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

See also [Node concept](../../../concepts/nodes.md)