---
title: POST /api/node/access
slug: /api/rest/node/access
---

Grant personal access to a node (or branch) for a user by email. Equivalent to [node:access](/api/ws/node/access) in WebSocket.

## Behavior

* The caller must have at least **admin** permission on the node.
* The access level defines user capabilities: `1=Admin`, `2=Editor`, `3=Viewer`. 
* Optionally, a `due` timestamp can set expiration.
* The `branch` flag controls whether access applies to the entire branch.

**Endpoint:** `POST /api/node/access`  
**Auth:** API token  
**Rate limit:** 300 requests/minute

**Request body:**
```json
{
  "id": "<uuid>",                    // required, node ID
  "email": "user@example.com",       // required, target user email
  "level": 2,                        // optional, default=3 (Viewer)
  "due": "2025-12-01T12:00:00Z",     // optional expiration
  "branch": true                     // optional, default=true
}
```

**200 OK**
```json
{
  "ok": true,
  "diff": {
    "access": [
      {
        "op": 20,                 // GRANT_UPSERT=20
        "before": {},
        "after": {
          "email": "user@example.com",
          "level": 2,             // Editor
          "due": "2025-12-01T12:00:00Z",
          "branch": true,
          "version": 0
        }
      }
    ],
    "nodes": [],
    "links": [],
    "user": [],
  }
}
```
**Errors:** see **[error codes](/api/error-codes)**

## Examples

### Python
```py
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

payload = {
    "id": "uuid-node-id",
    "email": "user@example.com",
    "level": 2,
    "due": "2025-12-01T12:00:00Z",
    "branch": True
}

resp = requests.post(
    f"{API_BASE}/node/access",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    },
    json=payload
)

if resp.status_code != 200:
    print("Failed:", resp.text)
else:
    print("Access granted diff:", resp.json()["diff"])

```

### JavaScript
```js
const resp = await fetch("/api/node/access", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    id: "uuid-node-id",
    email: "user@example.com",
    level: 2,
    due: "2025-12-01T12:00:00Z",
    branch: true
  })
});
const data = await resp.json();
console.log("Access granted diff:", data.diff);
```

See also [Node concept](../../../concepts/nodes.md) and [Trash concept](../../../concepts/trash.md)