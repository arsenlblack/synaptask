---
title: POST /api/link
slug: /api/rest/link/add
---

Create a new link between two nodes.  Equivalent to [link:add](/api/ws/link/add) in WebSocket.

## Behavior

* A link represents a dependency between nodes.
* History batch records link creation and all side effects (e.g., cascading blocking of ancestors).
* If same or reversed link are in trash – it will be restored insted of creation new.
* `type`:
  * `1` → secondary link (non-blocking).
  * `0 (default)` → primary link (blocking): source blocks target.  
    Will be automaticly changed to `1` (secondary) if caller has **viewer** or lower access for `target` node.
* `private`:
  * `true` → visible only for owner.
  * `false (default)` → visible for everyone.  
  
  Will be automaticly changed according to the ACL rules:
  |   Source⇩\Target⇨   |    Owner   |    Admin    |    Editor  |   Viewer
  | -------------------- | ---------- | ----------- | ---------- | ---------
  |     **Owner**        | *provided* | *provided*  | *provided* | `true`
  |     **Admin**        | *provided* | *provided*  | *provided* | `true`
  |     **Editor**       | *provided* | *provided*  | *provided* | `true`
  |     **Viewer**       | *provided* |   `true`    |   `true`   | `true`

## REST API

**Endpoint:** `POST /api/link`
**Auth:** API token
**Rate limit:** 300 requests per minute

**Request body:**

```json
{
  "source": "<uuid>",   // source node id
  "target": "<uuid>",   // target node id
  "type": 0,            // 0 = primary, 1 = secondary
  "private": false
}
```

**200 OK**

```json
{
  "ok": true,
  "diff": {
    "batchId": "uuid-of-history-batch",     // history batch ID (groups operations)
    "actor": {                              // who performed the action
      "username": "alice",
      "email": "alice@example.com"
    },
    "ts": "2025-09-25T10:15:00Z",           // timestamp in UTC ISO8601

    "links": [
      {
        "op": 10,                            // History operation type LINK_ADD=10
        "before": {},                       // empty for creation
        "after": {
          "id": "uuid",
          "source": "node-uuid-A",
          "target": "node-uuid-B",
          "type": 0,
          "private": true,
          "wasBlocker": true,
          "version": 1,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "createdTime": "2025-09-13T10:00:00Z",
          "lastEditedTime": "2025-09-13T10:00:00Z"
        }
      }
    ],

    "nodes": [
      { // Example: cascade blocking of target
        "op": 2,                            // History operation type NODE_STATUS=2
        "before": {
          "id": "uuid",
          "status": 1,
          "version": 4
        },
        "after": {
          "id": "uuid",
          "status": 2,                      // BLOCKED
          "version": 5,
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
* `links` — list with created link.
* `nodes` — any nodes affected by cascade blocking (if primary link).

**Errors:** see **[error codes](/api/error-codes)**

## Example (JavaScript)

```js
async function createLink(apiBaseUrl, apiToken, sourceId, targetId, type = 0) {
  const resp = await fetch(`${apiBaseUrl}/link`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ source: sourceId, target: targetId, type })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(`Link create failed: ${resp.status} ${err.error || ''}`);
  }

  return resp.json();
}

// usage
createLink('https://synaptask.space/api', '<YOUR_API_TOKEN>', 'src-uuid', 'tgt-uuid', 0)
  .then(data => console.log('Created link diff:', data.diff))
  .catch(console.error);
```

## Example (Python)

```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

resp = requests.post(
    f"{API_BASE}/link",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    },
    json={"source": "src-uuid", "target": "tgt-uuid", "type": 0}
)

if resp.status_code != 200:
    try:
        err = resp.json()
    except Exception:
        err = {}
    raise RuntimeError(f"Link create failed: {resp.status_code} {err}")

data = resp.json()
print("Created link diff:", data["diff"])
```

See also [Link concept](../../../concepts/links.md) and [Node concept](../../../concepts/nodes.md)