---
title: DELETE /api/node
slug: /api/rest/node/delete
---

Permanently delete a node. Equivalent to [node:delete](/api/ws/node/delete) in WebSocket.

## Behavior

* Caller must provide a valid `id` of an existing node.
* This operation **permanently removes** the node from trash.
* Only **owner** can purge.
* History batch records the purging, and the diff includes the purged links.
* Relative trashed links are also included in the diff.

## REST API

**Endpoint:** `DELETE /api/node`  
**Auth:** API token  
**Rate limit:** 300 requests per minute

**Request body:**

```json
{
  "id": "<uuid>"   // required
}
```

**200 OK**

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

**Errors:** see **[error codes](/api/error-codes)**

## Example (JavaScript)

```js
async function deleteNode(apiBaseUrl, apiToken, id) {
  const resp = await fetch(`${apiBaseUrl}/node`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ id })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(`Node delete failed: ${resp.status} ${err.error || ''}`);
  }

  return resp.json();
}

// usage
deleteNode('https://synaptask.space/api', '<YOUR_API_TOKEN>', 'uuid-node-id')
  .then(data => console.log('Deleted node diff:', data.diff))
  .catch(console.error);
```

## Example (Python)

```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

payload = { "id": "uuid-node-id" }

resp = requests.delete(
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
    raise RuntimeError(f"Node delete failed: {resp.status_code} {err}")

data = resp.json()
print("Deleted node diff:", data["diff"])
```

See also [Node concept](../../../concepts/nodes.md)