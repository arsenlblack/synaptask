---
title: PUT /api/node/access
slug: /api/rest/node/access_update
---

Update existing access to a node/branch (change level, due, or branch flag). Equivalent to [node:access:update](/api/ws/node/access_update) in WebSocket.

## Behavior

* The caller must have at least **admin** permission on the node.
* Cannot update access for users who are not already shared.
* Only the specified fields are updated.

**Endpoint:** `PUT /api/node/access`  
**Auth:** API token  
**Rate limit:** 300 requests/minute

**Request body:**
```json
{
  "id": "<uuid>",                    // required, node ID
  "email": "user@example.com",       // required
  "level": 1,                        // optional, default keeps old level
  "due": null,                       // optional expiration update, `null` is foreva
  "branch": true                     // optional, default keeps old value
}
```

**200 OK**
```json
{
  "ok": true,
  "diff": {
    "access": [
      {
        "op": 21,                       // GRANT_UPDATE=21
        "before": {
          "email": "user@example.com",
          "level": 2,                   // Editor
          "due": "2025-12-01T12:00:00Z",
          "branch": false,
          "version": 1
        },
        "after": {
          "email": "user@example.com",
          "level": 1,                    // Admin
          "due": null,                   // Foreva
          "branch": true,
          "version": 2
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
    "level": 1,
    "due": "2025-12-01T12:00:00Z"
}

resp = requests.put(
    f"{API_BASE}/node/access",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    },
    json=payload
)

if resp.status_code != 200:
    print("Error:", resp.json())
else:
    print("Access updated diff:", resp.json()["diff"])
```

### JavaScript
```js
const resp = await fetch("/api/node/access", {
  method: "PUT",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    id: "uuid-node-id",
    email: "user@example.com",
    level: 1,
    due: "2025-12-01T12:00:00Z"
  })
});
const data = await resp.json();
console.log("Access updated:", data.diff);
```

See also [Node concept](../../../concepts/nodes.md) and [History concept](../../../concepts/history.md)