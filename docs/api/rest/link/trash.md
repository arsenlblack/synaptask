---
title: POST /api/link/trash
slug: /api/rest/link/trash
---

Move an existing link to the trash (soft delete). Equivalent to [link:trash](/api/ws/link/trash) in WebSocket.

## Behavior

* A trashed link can be restored or later removed with `DELETE /api/link`.
* History batch records the link removal and all cascading side effects (e.g., nodes becoming unblocked if dependency was removed).
* Caller must be **owner** of link <u>or</u> have at least **editor** access on target node and at least **viewer** access on source node.

## REST API

**Endpoint:** `POST /api/link/trash`  
**Auth:** API token  
**Rate limit:** 300 requests per minute  

**Request body:**

```json
{
  "id": "<uuid>"     // link ID to move to trash
}
```

**200 OK**

```json
{
  "ok": true,
  "diff": {
    "batchId": "uuid-of-history-batch",
    "actor": {
      "username": "alice",
      "email": "alice@example.com"
    },
    "ts": "2025-09-25T10:15:00Z",

    "links": [
      {
        "op": 12,               // History operation type LINK_TRASH=12
        "before": {
          "id": "uuid",
          "inTrash": false,
          "type": 0,
          "version": 3
        },
        "after": {
          "id": "uuid",
          "inTrash": true,
          "version": 4,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-25T10:15:00Z"
        }
      }
    ],
    "nodes": [ // Side effects
      {
        "op": 2,            // NODE_STATUS=2
        "before": {
          "id": "uuid",
          "status": 2,      // Blocked=2
          "version": 5
        },
        "after": {
          "id": "uuid",
          "status": 1,      // Available=1
          "version": 6,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-25T10:15:00Z"
        }
      }
    ],
    "user": [],
    "access": [],
  }
}
```

* `links` — the trashed link entry.  
* `nodes` — any nodes affected by cascade unblock.  

**Errors:** see **[error codes](/api/error-codes)**

## Example (JavaScript)

```js
async function trashLink(apiBaseUrl, apiToken, linkId) {
  const resp = await fetch(`${apiBaseUrl}/link/trash`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ id: linkId })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(`Link trash failed: ${resp.status} ${err.error || ''}`);
  }

  return resp.json();
}

// usage
trashLink('https://synaptask.space/api', '<YOUR_API_TOKEN>', 'link-uuid')
  .then(data => console.log('Trashed link diff:', data.diff))
  .catch(console.error);
```

## Example (Python)

```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

resp = requests.post(
    f"{API_BASE}/link/trash",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    },
    json={"id": "link-uuid"}
)

if resp.status_code != 200:
    try:
        err = resp.json()
    except Exception:
        err = {}
    raise RuntimeError(f"Link trash failed: {resp.status_code} {err}")

data = resp.json()
print("Trashed link diff:", data["diff"])
```

See also [Link concept](../../../concepts/links.md) and [Trash concept](../../../concepts/trash.md)