---
title: GET /api/branch
slug: /api/rest/get_branch
---

Retrieve a branch (subgraph) visible to the authenticated user. Equivalent to [branch:get](/api/ws/get_branch) in WebSocket.

## Visibility Rules

* If `root` is a **UUID**, returns the branch visible to the authenticated user (private/shared context).
* If `root` is a **public token**, returns the branch visible publicly via `PublicToken`.
  * If the node has `PublicBranch = false`, only the root node is returned.
  * Otherwise, the full public branch is expanded recursively.

## REST API

**Endpoint:** `GET /api/branch`  
**Auth:** Bearer API token (`Authorization: Bearer <token>`)  
**Rate limit:** 300 requests per minute

**Query parameters:**

| Name     | Type                   | Required | Description                                     |
| -------- | ---------------------- | -------- | ----------------------------------------------- |
| `root`   | string (uuid or token) | ✅       | Root node ID or public token.                   |
| `limit`  | int                    | optional | Max number of records (default 1000, max 5000). |
| `offset` | int                    | optional | Pagination offset (default 0).                  |

**200 OK**

```json
{
  "ok": true,
  "nodes": [...],
  "links": [...],
  "hasMore": true
}
```

**Errors:** see [error codes](/api/error-codes)

## Example (JavaScript)

```js
async function fetchBranch(apiBaseUrl, apiToken, root) {
  let allNodes = [];
  let allLinks = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const resp = await fetch(`${apiBaseUrl}/branch?root=${root}&limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json'
      }
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(`Branch request failed: ${resp.status} ${err.error || ''}`);
    }

    const data = await resp.json();
    allNodes.push(...(data.nodes || []));
    allLinks.push(...(data.links || []));

    if (data.hasMore) {
      offset += limit;
    } else {
      break;
    }
  }

  console.log('Branch fully loaded');
  console.log('Total nodes:', allNodes.length);
  console.log('Total links:', allLinks.length);

  return { nodes: allNodes, links: allLinks };
}
```

## Example (Python)

```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"
ROOT = "<UUID_OR_TOKEN>"

all_nodes = []
all_links = []
offset = 0
limit = 1000

while True:
    resp = requests.get(
        f"{API_BASE}/branch",
        headers={"Authorization": f"Bearer {API_TOKEN}"},
        params={"root": ROOT, "limit": limit, "offset": offset},
        timeout=30,
    )

    if resp.status_code != 200:
        try:
            err = resp.json()
        except Exception:
            err = {}
        raise RuntimeError(f"Branch request failed: {resp.status_code} {err}")

    data = resp.json()
    all_nodes.extend(data.get("nodes", []))
    all_links.extend(data.get("links", []))

    print(f"Received {len(data.get('nodes', []))} nodes (offset={offset})")

    if data.get("hasMore"):
        offset += limit
    else:
        break

print("Branch fully loaded")
print(f"Total nodes: {len(all_nodes)}, Total links: {len(all_links)}")
```
