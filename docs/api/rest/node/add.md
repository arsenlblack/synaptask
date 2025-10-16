---
title: POST /api/node
slug: /api/rest/node/add
---

Create a new node, optionally under a parent node. Equivalent to [node:add](/api/ws/node/add) in WebSocket.

## Behavior

* If `target` is provided, the new node is attached as a child of the given parent.
* If no target is provided, node is owned solely by the creator with full access by default.
* ACL:
  * Caller must have at least **editor** access to the parent node.
  * New node **inherits** the owner and ACL from the parent node.
  * View-only is insufficient.
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
* History batch records node creation, the link (if any) and all side effects like blocking parent (if any).

## REST API

**Endpoint:** `POST /api/node`
**Auth:** API token
**Rate limit:** 300 requests per minute

**Request body:**

```json
{
  "target": "<uuid>",   // optional parent node id
  "title": "string",
  "description": "string",
  "status": 0,
  "dueDate": "2025-09-13T10:00:00Z",
  "tags": ["backend", "urgent"],
  "priority": 5,
  "independent": false,
  "volume": 5,
  "assignee": ["user-id"],
  "pinned": false,
  "collapsed": false
}
```

**200 OK**

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
          "independent": false,
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
**Errors:** see **[error codes](/api/error-codes)**

## Example (JavaScript)

```js
async function createNode(apiBaseUrl, apiToken, payload, target) {
  const resp = await fetch(`${apiBaseUrl}/node`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ ...payload, target })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(`Node create failed: ${resp.status} ${err.error || ''}`);
  }

  return resp.json();
}

// usage
createNode('https://synaptask.space/api', '<YOUR_API_TOKEN>', { title: 'My Task' }, null)
  .then(data => console.log('Created node diff:', data.diff))
  .catch(console.error);
```

## Example (Python)

```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

payload = {
    "title": "My Task",
    "description": "A new task",
    "status": 0,
}

resp = requests.post(
    f"{API_BASE}/node",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    },
    json=payload
)

if resp.status_code != 200:
    try:
        err = resp.json()
    except Exception:
        err = {}
    raise RuntimeError(f"Node create failed: {resp.status_code} {err}")

data = resp.json()
print("Created node diff:", data["diff"])
```

See also [Node concept](../../../concepts/nodes.md)