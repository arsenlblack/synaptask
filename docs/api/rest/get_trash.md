---
title:  GET /api/trash
slug: /api/rest/get_trash
---

Retrieve nodes and links currently in the user’s Trash.  
Equivalent to [trash:page](/api/ws/get_trash) in WebSocket.

**Endpoint:** `GET /api/trash`  
**Auth:** Bearer API token (`Authorization: Bearer <token>`)  
**Rate limit:** 300 requests per minute  

**Query parameters:**
- `limit` *(int, optional, default=100, max=1000)* — number of trashed items to return per page.
- `offset` *(int, optional, default=0)* — offset for pagination.

**200 OK**
```json
{
  "ok": true,
  "hasMore": true,
  "nodes": [
    {
      "id": "uuid",
      "title": "Old feature draft",
      "status": 0,
      "inTrash": true,
      "lastBatchID": "2dfce0ab-fc2b-4a3d-9ecb-b66dc45f9d7a",
      "version": 3,
      "lastEditedTime": "2025-10-02T11:00:00Z",
      "ownerUsername": "BLACK",
      "ownerEmail": "black@synaptask.space"
    }
  ],
  "links": [
    {
      "id": "uuid",
      "source": "uuid-source",
      "target": "uuid-target",
      "type": 0,
      "version": 1,
      "inTrash": true,
      "lastBatchID": "2dfce0ab-fc2b-4a3d-9ecb-b66dc45f9d7a"
    }
  ]
}
```
**Errors:** see **[error codes](/api/error-codes)**

## Example (JavaScript)
```js
async function fetchTrash(apiBaseUrl, apiToken) {
  let nodes = [];
  let links = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const resp = await fetch(`${apiBaseUrl}/trash?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json'
      }
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(`Trash request failed: ${resp.status} ${err.error || ''}`);
    }

    const data = await resp.json();
    nodes.push(...(data.nodes || []));
    links.push(...(data.links || []));

    console.log(`Received ${data.nodes?.length || 0} nodes, ${data.links?.length || 0} links`);

    if (data.hasMore) offset += limit;
    else break;
  }

  console.log('Trash fully loaded:', nodes.length, 'nodes', links.length, 'links');
  return { nodes, links };
}
```

## Example (Python)
```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

all_nodes, all_links = [], []
offset, limit = 0, 100

while True:
    resp = requests.get(
        f"{API_BASE}/trash",
        headers={"Authorization": f"Bearer {API_TOKEN}"},
        params={"limit": limit, "offset": offset},
        timeout=30,
    )

    if resp.status_code != 200:
        try:
            err = resp.json()
        except Exception:
            err = {}
        raise RuntimeError(f"Trash request failed: {resp.status_code} {err}")

    data = resp.json()
    all_nodes.extend(data.get("nodes", []))
    all_links.extend(data.get("links", []))

    print(f"chunk: +{len(data.get('nodes', []))} nodes, +{len(data.get('links', []))} links")

    if data.get("hasMore"):
        offset += limit
    else:
        break

print("Trash fully loaded:", len(all_nodes), "nodes,", len(all_links), "links")
```

See also [Get graph](get_graph.md)