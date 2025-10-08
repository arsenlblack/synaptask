---
title: POST /api/node/public
slug: /api/rest/node/publish
---

Publish a node or an entire branch publicly.  
Equivalent to [node:publish](/api/ws/node/publish) via WebSocket.

## Behavior

* Publishes a node to make it **publicly accessible (read-only)**.
* If `"branch": true` (default) — all descendant nodes also become part of this public branch.
* If `"branch": false` — only the node itself becomes public.
* Generates a unique `publicToken` which can be used for embedding or anonymous viewing.


**Endpoint:** `POST /api/node/public`  
**Auth:** API token  
**Rate limit:** 300 requests per minute

**Request body:**

```json
{
  "id": "<uuid>",                // required
  "due": "2025-11-01T12:00:00Z", // optional expiration
  "branch": true,                // optional (default=true)
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
    "ts": "2025-10-04T18:00:00Z",
    "nodes": [ // if userId omitted
      {
        "op": 6,          // NODE_PUBLISH=6
        "before": {
          "id": "node-id",
          "publicToken": null
        },
        "after": {
          "id": "node-id",
          "publicToken": "xyz123abc",
          "publicBranch": true,
          "publicDue": "2025-11-01T12:00:00Z",
          "version": 5
        }
      }
    ],
    "links": [],
    "user": [],
    "access": [],
  }
}
```

**Errors:** see **[error codes](/api/error-codes)**

---

## Example (JavaScript)

```js
const API_BASE = 'https://synaptask.space/api';
const API_TOKEN = '<YOUR_API_TOKEN>';

async function publishNode(id, due, branch = true) {
  const resp = await fetch(`${API_BASE}/node/public`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, due, branch })
  });

  const data = await resp.json();
  if (!resp.ok || !data.ok) {
    throw new Error(`Publish failed: ${data.error || resp.statusText}`);
  }

  console.log('Published node diff:', data.diff);
}

publishNode('uuid-node-id', '2025-12-01T00:00:00Z', true)
  .catch(console.error);

```
---

## Example (Python)

```python
import requests
from datetime import datetime, timedelta

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

payload = {
    "id": "uuid-node-id",
    "due": (datetime.utcnow() + timedelta(days=30)).isoformat() + "Z",
    "branch": True
}

resp = requests.post(
    f"{API_BASE}/node/public",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    },
    json=payload
)

data = resp.json()
if not data.get("ok"):
    raise RuntimeError(f"Publish failed: {data}")
print("Published node diff:", data["diff"])
```

See also [Node concept](../../../concepts/nodes.md) and [Account concept](../../../concepts/account.md)