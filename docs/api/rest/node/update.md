---
title: PUT /api/node
slug: /api/rest/node/update
---

Update fields of an existing node. Equivalent to [node:update](/api/ws/node/update) in WebSocket.

## Behavior

* Caller must provide a valid `id` of an existing node.
* Only the fields included in the request body are updated.
* ACL:
  * Caller must have at least **editor** access to the node.
  * View-only is insufficient.
* History batch records the field updates, and the diff includes only changed fields.
* Side effects (e.g. status change propagations) are also included in the diff.

## REST API

**Endpoint:** `PUT /api/node`  
**Auth:** API token  
**Rate limit:** 300 requests per minute

**Request body:**

```json
{
  "id": "<uuid>",              // required
  "title": "string",
  "status": 3,                // 3=Completed
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
        "op": 1,               // History operation NODE_UPDATE=1
        "before": {
          "id": "uuid",
          "title": "Old title",
          "version": 4
        },
        "after": {
          "id": "uuid",
          "title": "New title",
          "version": 5,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-25T10:00:00Z"
        }
      },
      {
        "op": 2,               // History operation NODE_STATUS=2; changing status is a special separate operation
        "before": {
          "id": "uuid",
          "status": 1,        // 1=Available
          "version": 5
        },
        "after": {
          "id": "uuid",
          "title": "New title",
          "status": 3,        // 3=Completed
          "version": 6,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-25T10:00:00Z"
        }
      },
      {  // Side effect
        "op": 2,
        "before": {
          "id": "uuid2",
          "status": 2,        // 2=Blocked
          "version": 10
        },
        "after": {
          "id": "uuid2",
          "title": "New title",
          "status": 1,        // 1=Available
          "version": 11,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-25T10:00:00Z"
        }
      }
    ],

    "links": [],
    "user": [],
    "access": [],
  }
}
```
:::info
Changing status is always a separate operation.
:::
:::note
The diff includes only changed fields in `before` and `after`.  
Consumers must merge by `id+version`, not overwrite blindly.  
Side effects (e.g., blocking parent status updates) will also be included with their minimal changes.
:::

**Errors:** see **[error codes](/api/error-codes)**

## Example (JavaScript)

```js
async function updateNode(apiBaseUrl, apiToken, id, fields) {
  const resp = await fetch(`${apiBaseUrl}/node`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ id, ...fields })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(`Node update failed: ${resp.status} ${err.error || ''}`);
  }

  return resp.json();
}

// usage
updateNode('https://synaptask.space/api', '<YOUR_API_TOKEN>', 'uuid-node-id', { title: 'Updated Task' })
  .then(data => console.log('Updated node diff:', data.diff))
  .catch(console.error);
```

## Example (Python)

```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

payload = {
    "id": "uuid-node-id",
    "title": "Updated Task",
    "status": 1
}

resp = requests.put(
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
    raise RuntimeError(f"Node update failed: {resp.status_code} {err}")

data = resp.json()
print("Updated node diff:", data["diff"])
```

See also [Node concept](../../../concepts/nodes.md) and [History concept](../../../concepts/history.md)