---
title: DELETE /api/node/access
slug: /api/rest/node/access_revoke
---

Revoke (remove) a user's access to a node/branch. Equivalent to [node:access:delete](/api/ws/node/access_revoke) in WebSocket.

## Behavior

* The caller must have at least **admin** access to the node.
* Revocation removes the user's permission immediately.
* If no other personal or public access exists, the node becomes private for that user.

**Endpoint:** `DELETE /api/node/access`  
**Auth:** API token  
**Rate limit:** 300 requests/minute

**Request body:**
```json
{
  "id": "<uuid>",                    // required, node ID
  "email": "user@example.com"        // required, target user email
}
```

**200 OK**
```json
{
  "ok": true,
  "diff": {
    "access": [
      {
        "op": 22,                       // GRANT_DELETE=22
        "before": {
          "email": "user@example.com",
          "level": 3,                   // Viewer
          "due": "2025-12-01T12:00:00Z",
          "branch": false,
          "version": 2
        },
        "after": {}
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

### Ptrhon
```py
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

payload = {
    "id": "uuid-node-id",
    "email": "user@example.com"
}

resp = requests.delete(
    f"{API_BASE}/node/access",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    },
    json=payload
)

if resp.status_code != 200:
    print("Revoke failed:", resp.status_code, resp.text)
else:
    print("Access revoked diff:", resp.json()["diff"])
```

### JavaScript
```js
const resp = await fetch("/api/node/access", {
  method: "DELETE",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    id: "uuid-node-id",
    email: "user@example.com"
  })
});
const data = await resp.json();
console.log("Access revoked diff:", data.diff);
```

See also [Node concept](../../../concepts/nodes.md) and [History concept](../../../concepts/history.md)