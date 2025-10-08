---
title: node:delete
slug: /api/ws/node/delete
---

Permanently delete a node via WebSocket event. Equivalent to [DELETE /api/node](/api/rest/node/delete) in REST.

## Visibility & Permissions

* Only **owner** can purge.
* After deletion:
  * The node is removed completely from the graph.
  * All links (incoming/outgoing) are deleted.
  * History batch records node removal and all side effects.
* If the node does not exist or user has insufficient rights → error.

### Client → Server `node:delete`
```json
{
  "id": "<uuid>"   // required, node identifier
}
```

### Success (ack)

```json
{
  "ok": true,
  "diff": {
    "batchId": "uuid",
    "actor": {
      "username": "alice",
      "email": "alice@example.com"
    },
    "ts": "2025-09-25T10:00:00Z",

    "nodes": [
      {
        "op": 5,                // History operation NODE_DELETE=5
        "before": { 
          "id": "uuid",
          "title": "string",
          "description": "string",
          "status": 0,
          "dueDate": "2025-09-13T10:00:00Z",
          "type": 0,
          "tags": ["backend", "urgent"],
          "priority": 5,
          "dependent": true,
          "volume": 5,
          "assignee": [],
          "pinned": false,
          "collapsed": false,
          "version": 0,
          "createdTime": "2025-09-13T10:00:00Z",
          "lastEditedTime": "2025-09-13T10:00:00Z",
          "publicToken": "string",
          "inTrash": true,
          "access": 0,
          "shareRoots": ["uuid1", "uuid2"]
        },
        "after": {
          "id": "uuid",
          "deleted": true,
          "shareRoots": ["root-uuid-1"]
        }
      }
    ],

    "links": [
      {
        "op": 14,                // History operation LINK_DELETE=14
        "before": {
          "id": "uuid",
          "source": "uuid",
          "target": "uuid",
          "type": 0,
          "version": 0,
          "wasBlocker": false
        },
        "after": {
          "id": "uuid",
          "deleted": true,
          "shareRoots": ["root-uuid-1"]
        }
      }
    ],
    "user": [],
    "access": [],
  }
}
```
:::info
The `diff` includes the deleted node(s) and all affected links.  
Consumers must merge diffs carefully — deleted entities appear with full `before` snapshot.
:::
:::danger
This operation is irreversible.  
Nodes and their links cannot be restored after this operation.
:::

### Broadcasting (`graph:diff`)
> On success, the server also emits `"graph:diff"` to all ACL rooms.  
> The initiating client receives the ACK directly and is excluded from the broadcast.

### Error (ack)

```json
{
  "ok": false,
  "error": "bad_request" | "forbidden" | "not_found" | "conflict" | "internal.exception",
  "message": "<optional human-readable>",
  "trace_id": "abc123def456"
}
```
**Errors:** see **[error codes](/api/error-codes)**

## Examples

### JavaScript

```js
socket.emit("node:delete", { id: "c3a7f13e-aaaa-bbbb-cccc-d9f99f5b7e42" }, (resp) => {
  if (resp.ok) {
    console.log("Node deleted", resp.diff);
  } else {
    console.error("Delete failed:", resp.error);
  }
});
```

### Python (socketio-client)

```python
import socketio
sio = socketio.Client()

sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <API_TOKEN>"})
resp = sio.call("node:delete", {"id": "c3a7f13e-aaaa-bbbb-cccc-d9f99f5b7e42"}, timeout=5)
if resp.get("ok"):
    print("Node deleted:", resp["diff"])
else:
    print("Failed:", resp["error"])
```

See also [Node concept](../../../concepts/nodes.md)