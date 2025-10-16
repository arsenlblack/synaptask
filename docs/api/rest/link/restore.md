---
title: POST /api/link/restore
slug: /api/rest/link/restore
---

Restore an existing link from the trash. Equivalent to [link:restore](/api/ws/link/restore) in WebSocket.

## Behavior

* A restored link becomes active again.  
* Caller must be **owner** of the link <u>or</u> have at least **editor** access on target node and at least **viewer** access on source node.
* History batch records the link restoration.

## REST API

**Endpoint:** `POST /api/link/restore`  
**Auth:** API token  
**Rate limit:** 300 requests per minute  

### Request body

```json
{
  "id": "<uuid>"     // link ID to restore
}
```

### 200 OK

```json
{
  "ok": true,
  "diff": {
    "batchId": "uuid-of-history-batch",
    "actor": {
      "username": "alice",
      "email": "alice@example.com"
    },
    "ts": "2025-09-25T11:00:00Z",

    "links": [
      {
        "op": 13,               // LINK_RESTORE=13
        "before": {
          "id": "uuid",
          "inTrash": true,
          "type": 0,
          "version": 4
        },
        "after": {
          "id": "uuid",
          "source": "node-uuid-A",
          "target": "node-uuid-B",
          "type": 0,
          "wasBlocker": true,
          "private": true,
          "version": 1,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "createdTime": "2025-09-13T10:00:00Z",
          "lastEditedTime": "2025-09-13T10:00:00Z",
          "lastBatchID": "batch-uuid",
          "version": 5,
          "inTrash": false,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-13T10:00:00Z"
        }
      }
    ],
    "nodes": [ // Side effects
      {
        "op": 2,            // NODE_STATUS=2
        "before": {
          "id": "uuid",
          "status": 1,      // Available=1
          "version": 5
        },
        "after": {
          "id": "uuid",
          "status": 2,      // Blocked=2
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

**Errors:** see **[error codes](/api/error-codes)**

---

## Example (JavaScript)

```js
async function restoreLink(apiBaseUrl, apiToken, linkId) {
  const resp = await fetch(`${apiBaseUrl}/link/restore`, {
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
    throw new Error(`Link restore failed: ${resp.status} ${err.error || ''}`);
  }

  return resp.json();
}

// usage
restoreLink('https://synaptask.space/api', '<YOUR_API_TOKEN>', 'link-uuid')
  .then(data => console.log('Restored link diff:', data.diff))
  .catch(console.error);
```

## Example (Python)

```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

resp = requests.post(
    f"{API_BASE}/link/restore",
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
    raise RuntimeError(f"Link restore failed: {resp.status_code} {err}")

data = resp.json()
print("Restored link diff:", data["diff"])
```

See also [Link concept](../../../concepts/links.md) and [Trash concept](../../../concepts/trash.md)