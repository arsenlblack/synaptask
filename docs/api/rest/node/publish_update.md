---
title: PUT /api/node/public
slug: /api/rest/node/publish_update
---

Update expiration date or branch mode of a public node or branch.
Equivalent to [node:publish:udate](/api/ws/node/publish_update) WebSocket event.

## Behavior

* Caller must have at least **admin** access of the node.
* Node must already be **public**.
* Changing `branch` toggles whether the entire branch or only the node is visible.
* Updating `due` sets or extends expiration time. `null=foreva` 😁 

---

### REST API

**Endpoint:** `PUT /api/node/public`
**Auth:** API token
**Rate limit:** 300 requests per minute

**Request body:**

```json
{
  "id": "<uuid>",                // required
  "due": "2025-12-01T10:00:00Z", // optional
  "branch": true                 // optional
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

### Error (ack)

```json
{
  "ok": false,
  "error": "forbidden" | "invalid_due" | "no_permission" | "internal.exception",
  "trace_id": "abc123def456"
}
```

**Errors:** see **[error codes](/api/error-codes)**

---

### Example (JavaScript)

```js
socket.emit("node:publish:update", {
  id: "uuid-node-id",
  due: "2025-12-01T10:00:00Z",
  branch: false
}, (resp) => {
  if (resp.ok) console.log("Public node updated", resp.diff);
  else console.error("Failed", resp.error);
});
```

---

### Example (Python)

```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

payload = {
    "id": "uuid-node-id",
    "due": "2025-12-01T10:00:00Z",
    "branch": True
}

resp = requests.put(
    f"{API_BASE}/node/public",
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
        raise RuntimeError(f"Public update failed: {resp.status_code} {err}")


data = resp.json()
print("Updated public node:", data["diff"])
```

See also [Node concept](../../../concepts/nodes.md) and [Account concept](../../../concepts/account.md)
