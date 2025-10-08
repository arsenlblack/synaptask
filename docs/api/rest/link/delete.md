---
title: DELETE /api/link
slug: /api/rest/link/delete
---

Permanently delete a link between two nodes. Equivalent to [link:delete](/api/ws/link/delete) in WebSocket.

## Behavior

* Purges **permanently** link from trash.
* Link must be in trash.
* Only **owner** can purge.

## REST API

**Endpoint:** `DELETE /api/link`  
**Auth:** API token  
**Rate limit:** 300 requests per minute  

**Request body:**

```json
{
  "id": "<uuid>"   // link id to delete
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
    "ts": "2025-09-25T10:20:00Z",

    "links": [
      {
        "op": 13,           // LINK_DELETE=13
        "before": {
          "id": "uuid",
          "source": "node-uuid-A",
          "target": "node-uuid-B",
          "type": 0,
          "wasBlocker": true,
          "version": 3,
          "shareRoots": ["root-uuid-1"]
        },
        "after": {
          "id": "uuid",
          "deleted": true,
          "shareRoots": ["root-uuid-1"]
        }
      }
    ],

    "nodes": [],
    "user": [],
    "access": [],
  }
}
```

**Errors:** see **[error codes](/api/error-codes)**

## Example (JavaScript)

```js
async function deleteLink(apiBaseUrl, apiToken, linkId) {
  const resp = await fetch(`${apiBaseUrl}/link`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ id: linkId })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(`Link delete failed: ${resp.status} ${err.error || ''}`);
  }

  return resp.json();
}

// usage
deleteLink('https://synaptask.space/api', '<YOUR_API_TOKEN>', 'link-uuid')
  .then(data => console.log('Deleted link diff:', data.diff))
  .catch(console.error);
```

## Example (Python)

```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

resp = requests.delete(
    f"{API_BASE}/link",
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
    raise RuntimeError(f"Link delete failed: {resp.status_code} {err}")

data = resp.json()
print("Deleted link diff:", data["diff"])
```

See also [Link concept](../../../concepts/links.md)