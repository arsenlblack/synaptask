---
title: GET /api/history
slug: /api/rest/history/get
---

Retrieve a paginated list of history batches visible to the current user.  
Each batch represents a set of operations (nodes, links, etc.) performed within a shared scope.

Equivalent to [history:page](/api/ws/history/get) in WebSocket.

**Endpoint:** `GET /api/history`  
**Auth:** Bearer API token (`Authorization: Bearer <token>`)  
**Rate limit:** 300 requests per minute  

### Query parameters:
- `scopeType` *(string, optional)* — if omitted, returns global history across all scopes visible to the user.
- `scopeId` *(UUID, optional)* — if omitted, aggregates all scopes where user has access.
- `limit` *(integer, optional, default=100, max=1000)* — number of batches per page.  
- `offset` *(integer, optional, default=0)* — pagination offset.

---

### 200 OK
```json
{
  "ok": true,
  "hasMore": true,
  "batches": [
    {
      "batchId": "b8e0c4cb-8ab7-4b2e-91cd-8fd92e1b9a20",
      "actor": {
        "username": "BLACK",
        "email": "black@synaptask.space"
      },
      "ts": "2025-10-08T10:45:02Z",
      "undone": false,
      "ops": [
        {
          "id": 100123,
          "type": 1,
          "entityId": "d83d2f10-f4c9-49b8-a93b-f8b0f2db1e54",
          "forwardPatch": { "Title": "New title" },
          "inversePatch": { "Title": "Old title" },
          "guard": { "Version": 2 },
          "createdTime": "2025-10-08T10:45:02Z"
        }
      ]
    }
  ]
}
```

**Field reference:**  
* `actor` — originator of the batch.  
* `ops[]` — chronological list of operations executed within the batch.  
* `forwardPatch` — describes applied changes.  
* `inversePatch` — describes state before changes (for Undo).  
* `guard` — version or integrity preconditions.

---

### Example (JavaScript)
```js
async function fetchHistory(apiBase, token, scopeType, scopeId) {
  let offset = 0, limit = 100, batches = [];
  while (true) {
    const resp = await fetch(`${apiBase}/history?scopeType=${scopeType}&scopeId=${scopeId}&limit=${limit}&offset=${offset}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const data = await resp.json();
    batches.push(...(data.batches || []));
    if (!data.hasMore) break;
    offset += limit;
  }
  console.log("Loaded", batches.length, "batches");
  return batches;
}
```

---

### Example (Python)
```python
import requests

API_BASE = "https://synaptask.space/api"
TOKEN = "<YOUR_API_TOKEN>"
SCOPE_TYPE = "GRAPH"
SCOPE_ID = "<uuid>"

offset, limit = 0, 100
all_batches = []

while True:
    r = requests.get(
        f"{API_BASE}/history",
        headers={"Authorization": f"Bearer {TOKEN}"},
        params={"scopeType": SCOPE_TYPE, "scopeId": SCOPE_ID, "limit": limit, "offset": offset},
        timeout=20,
    )
    r.raise_for_status()
    data = r.json()
    all_batches.extend(data.get("batches", []))
    if not data.get("hasMore"):
        break
    offset += limit

print("Loaded", len(all_batches), "batches")
```

See also [History concepts](../../../concepts/history.md)
