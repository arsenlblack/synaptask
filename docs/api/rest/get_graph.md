---
title: GET /api/graph
slug: /api/rest/get_graph
---

Retrieve the portion of the task graph visible to the authenticated user.

## Visibility Rules
- **Own nodes** of the user.
- **Public nodes** accessible via a `publicToken`.
- **Shared nodes** via `accesses` with `Showing = true`.
- If an access grant has `Branch = true`, include the entire subtree of descendants reachable via outbound links.
- **Access level per node** is the **maximum privilege granted**: `0=owner`, `1=admin`, `2=editor`, `3=viewer` (where 0 is the highest privilege).
- Links are returned **only between visible nodes**.

## REST API
**Endpoint:** `GET /api/graph`  
**Auth:** Bearer API token (`Authorization: Bearer <token>`)
**Rate limit:** 30 requests per minute

**Query parameters:**
- `limit` *(int, optional, default=1000, max=5000)* — max number of records (nodes+links).
- `offset` *(int, optional, default=0)* — offset for pagination.

**200 OK**
```json
{
  "ok": true,
  "hasMore": true,
  "graph": {
    "nodes": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "status": 0,
        "dueDate": "2025-09-13T10:00:00Z",
        "type": 0,
        "tags": ["backend", "urgent"],
        "priority": 5,
        "dependant": true,
        "volume": 5,
        "version": 0,
        "assignee": [],
        "createdTime": "2025-09-13T10:00:00Z",
        "lastEditedTime": "2025-09-13T10:00:00Z",
        "ownerUsername": "BLACK",
        "ownerEmail": "black@synaptask.space",
        "publicToken": "string",
        "x": 0.0,
        "y": 0.0,
        "z": 0.0,
        "pinned": false,
        "collapsed": false,
        "access": 0,
        "shareRoots": ["uuid1", "uuid2"]
      }
    ],
    "links": [
      {
        "id": "uuid",
        "source": "uuid",
        "target": "uuid",
        "type": 0,
        "version": 0,
        "wasBlocker": false
      }
    ]
  }
}
```
**Errors:** `401` unauthorized, `429` rate limited, `500` internal, `400` bad_request — invalid limit/offset or malformed query params.

## Example (JavaScript)
```js
async function fetchGraph(apiBaseUrl, apiToken) {
  let allNodes = [];
  let allLinks = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const resp = await fetch(`${apiBaseUrl}/graph?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json'
      }
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(`Graph request failed: ${resp.status} ${err.error || ''}`);
    }

    const data = await resp.json();
    const graph = data.graph;

    allNodes.push(...(graph.nodes || []));
    allLinks.push(...(graph.links || []));

    if (data.hasMore) {
      offset += limit;
    } else {
      break;
    }
  }

  console.log('Graph fully loaded');
  console.log('Total nodes:', allNodes.length);
  console.log('Total links:', allLinks.length);

  return { nodes: allNodes, links: allLinks };
}

// usage example
fetchGraph('https://synaptask.space/api', '<YOUR_API_TOKEN>')
  .then(({ nodes, links }) => {
    console.log('Final graph:', nodes.length, 'nodes,', links.length, 'links');
  })
  .catch(console.error);
```
## Example (Python)
```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

all_nodes = []
all_links = []
offset = 0
limit = 1000

while True:
    resp = requests.get(
        f"{API_BASE}/graph",
        headers={"Authorization": f"Bearer {API_TOKEN}"},
        params={"limit": limit, "offset": offset},
        timeout=30,
    )

    if resp.status_code != 200:
        try:
            err = resp.json()
        except Exception:
            err = {}
        raise RuntimeError(f"Graph request failed: {resp.status_code} {err}")

    data = resp.json()
    graph = data.get("graph", {})

    nodes = graph.get("nodes", [])
    links = graph.get("links", [])

    all_nodes.extend(nodes)
    all_links.extend(links)

    print(f"Received {len(nodes)} nodes, {len(links)} links (offset={offset})")

    if data.get("hasMore"):
        offset += limit
    else:
        break

print("Graph fully loaded")
print(f"Total nodes: {len(all_nodes)}, Total links: {len(all_links)}")
```
