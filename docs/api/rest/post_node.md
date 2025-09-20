---

title: POST /api/node
slug: /api/rest/post_node
---

Create a new node, optionally under a parent node.

## Behavior

* If `target` is provided, the new node is attached as a child of the given parent.
* ACL:
  * Caller must have at least **editor** access to the parent node.
  * New node **inherits** the owner and ACL from the parent node.
  * View-only is insufficient.
  :::info
  You can create a **stand-alone node** (without specifying `target`) 
  and later attach it to a read-only branch using [`POST /api/link`](./link_add). 

  In this case:
  - `"source"` → your new node’s `id`,  
  - `"target"` → the read-only node’s `id`,  
  - `"type": 1` → secondary link (keeps your graph consistent without changing branch ACLs).  

  This way, **you remain the owner** of the new node, while still preserving graph consistency and task dependencies.
  :::
* A primary link (type=0) is created if the parent is `dependant=true`, otherwise a secondary link (type=1).
* History batch records node creation, the link (if any) and all side effects like blocking parent (if any).

## REST API

**Endpoint:** `POST /api/node`
**Auth:** API token
**Rate limit:** `30/minute`

**Request body:**

```json
{
  "target": "<uuid>",   // optional parent node id
  "props": {
    "title": "string",
    "description": "string",
    "status": 0,
    "dueDate": "2025-09-13T10:00:00Z",
    "tags": "csv",
    "priority": 5,
    "dependant": true,
    "volume": 5,
    "asignee": ["user-id"],
    "pinned": false,
    "collapsed": false
  },
}
```

**200 OK**

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

**Errors:** `400` bad request, `401` unauthorized, `403` forbidden, `404` parent not found, `429` rate limited, `500` internal.

## Example (JavaScript)

```js
async function createNode(apiBaseUrl, apiToken, props, superId) {
  const resp = await fetch(`${apiBaseUrl}/node`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ props, superId })
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

props = {
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
    json={"props": props}
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
