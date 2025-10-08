---

title: DELETE /api/node/public
slug: /api/rest/node/unpublish
---

Unpublish a previously shared node or branch.  
This endpoint removes the node’s `PublicToken` and revokes all anonymous access.  
It is the reverse operation of [POST /api/node/public](/api/rest/node/publish).  
For WebSocket equivalent, see [node:unpublish](/api/ws/node/unpublish).

---

## Overview

Publishing a node creates a public link accessible to anyone with its `PublicToken`.
This operation also notifies all currently connected clients who have access to the affected branches.

---

## Behavior

* Removes the node’s `PublicToken` and `PublicDue` fields.
* ACL:
  * Caller must have at least **admin** access.

---

**Endpoint:** `DELETE /api/node/public`
**Auth:** API token
**Rate limit:** 300 requests per minute

### Request Body

```json
{
  "id": "<uuid>"   // required: the node or branch to unpublish
}
```

### 200 OK

```json
{
  "ok": true,
  "diff": {
    "batchId": "uuid",
    "actor": {
      "username": "john_doe",
      "email": "john@example.com"
    },
    "ts": "2025-10-04T10:00:00Z",

    "nodes": [
      {
        "op": 6,   // NODE_PUBLISH=6
        "before": {
          "id": "uuid",
          "publicToken": "abcd1234xyz",
          "publicDue": "2025-12-01T00:00:00Z",
          "version": 4
        },
        "after": {
          "id": "uuid",
          "publicToken": null,
          "publicDue": null,
          "version": 5,
          "lastEditedTime": "2025-10-04T10:00:00Z"
        }
      }
    ]
  }
}
```

**Errors:** see **[error codes](/api/error-codes)**

---

## Example (JavaScript)

```js
const API_BASE = 'https://synaptask.space/api';
const API_TOKEN = '<YOUR_API_TOKEN>';

async function unpublishNode(id) {
  const resp = await fetch(`${API_BASE}/node/public`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  });

  const data = await resp.json();
  if (!resp.ok || !data.ok) {
    throw new Error(`Unpublish failed: ${data.error || resp.statusText}`);
  }

  console.log('✅ Node successfully unpublished:', data.diff);
}

// Example call
unpublishNode('uuid-node-id').catch(console.error);
```

---

## Example (Python)

```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

payload = {"id": "uuid-node-id"}

resp = requests.delete(
    f"{API_BASE}/node/public",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    },
    json=payload
)

data = resp.json()
if not data.get("ok"):
    raise RuntimeError(f"Unpublish failed: {data}")
print("Node unpublish diff:", data["diff"])
```

## Notes for Integrators

* After unpublishing, any previously shared public URL becomes invalid.
* Attempting to access it will result in a `404 Not Found` or equivalent socket rejection.

See also [Node concept](../../../concepts/nodes.md) and [History concept](../../../concepts/history.md)