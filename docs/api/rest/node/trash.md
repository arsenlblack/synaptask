---
title: POST /api/node/trash
slug: /api/rest/node/trash
---

Move a node into the trash (soft delete). Equivalent to [node:trash](/api/ws/node/trash) in WebSocket.

## Behavior

* Caller must provide a valid `id` of an existing node.
* The node is marked as trashed but not permanently removed.
* ACL:
  * Caller must have at least **editor** access to the node.
  * View-only is insufficient.
* History batch records the trash operation, and the diff includes the node state change.
* Side effects (e.g. status change propagations) are also included in the diff.

## REST API

**Endpoint:** `POST /api/node/trash`  
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
    "batchId": "uuid",                // ID of the history batch
    "actor": {
      "username": "alice",
      "email": "alice@example.com"
    },
    "ts": "2025-09-25T10:00:00Z",     // timestamp of the operation

    "nodes": [
      {
        "op": 3,                      // NODE_TRASH=3
        "before": {
          "id": "uuid",
          "inTrash": false,
          "version": 3
        },
        "after": {
          "id": "uuid",
          "inTrash": true,
          "version": 4,
          "lastEditedTime": "2025-09-25T10:00:00Z",
          "shareRoots": ["uuid1", "uuid2"]
        }
      },
      // side effects:
      {
        "op": 2,                      // NODE_STATUS=2
        "before": {
          "id": "uuid2",
          "status": 2,                // Blocked=2
          "version": 7
        },
        "after": {
          "id": "uuid2",
          "status": 1,                // Available=1
          "version": 8,
          "lastEditedTime": "2025-09-25T10:00:00Z",
          "shareRoots": ["uuid1", "uuid2"]
        }
      }
    ],
    // all relative links will be trashed
    "links": [
      {
        "op": 12,                            // History operation type LINK_TRASH=12
        "before": {
          "id": "uuid",
          "inTrash": false,
          "version": 4
        },
        "after": {
          "id": "uuid",
          "version": 4,
          "inTrash": true,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-13T10:00:00Z"
        }
      },
      {  // side effect
        "op": 12,                            // History operation type LINK_TRASH=12
        "before": {
          "id": "uuid2",
          "inTrash": false,
          "version": 8
        },
        "after": {
          "id": "uuid2",
          "inTrash": true,
          "version": 9,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-13T10:00:00Z"
        }
      }
    ],
    "user": [],
    "access": [],
  }
}
```

:::note
The diff includes only changed fields in `before` and `after`.  
Consumers must merge by `id+version`, not overwrite blindly.  
Side effects (e.g., status updates) will also be included.
:::

**Errors:** see **[error codes](/api/error-codes)**

## Example (JavaScript)

```js
async function trashNode(apiBaseUrl, apiToken, id) {
  const resp = await fetch(`${apiBaseUrl}/node/trash`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ id })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(`Node trash failed: ${resp.status} ${err.error || ''}`);
  }

  return resp.json();
}

// usage
trashNode('https://synaptask.space/api', '<YOUR_API_TOKEN>', 'uuid-node-id')
  .then(data => console.log('Trashed node diff:', data.diff))
  .catch(console.error);
```

## Example (Python)

```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

payload = { "id": "uuid-node-id" }

resp = requests.post(
    f"{API_BASE}/node/trash",
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
    raise RuntimeError(f"Node trash failed: {resp.status_code} {err}")

data = resp.json()
print("Trashed node diff:", data["diff"])
```

See also [Node concept](../../../concepts/nodes.md) and [Trash concept](../../../concepts/trash.md)