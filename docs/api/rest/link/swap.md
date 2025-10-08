---
title: POST /api/link/swap
slug: /api/rest/link/swap
---

Swap **source** and **target** of an existing link. Equivalent to [link:swap](/api/ws/link/swap) in WebSocket.

## Behavior

* Swaps the direction of the link (reverses source and target).
* If caller is not allowed to **edit new target** (ex source) link type will be downgraded to **secondary** `type=1`.
* Side effects: blocks **new target** (ex source) and unbloks **new source** (ex target) if `type=0` **primary**.  
  

**Endpoint:** `POST /api/link/swap`  
**Auth:** API token  
**Rate limit:** 300 requests per minute  

**Request body:**

```json
{
  "id": "<uuid>"   // required, link id
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
        "op": 15,             // LINK_SWAP=15
        "before": {
          "id": "uuid",
          "source": "node-uuid-A",
          "target": "node-uuid-B",
          "version": 2
        },
        "after": {
          "id": "uuid",
          "source": "node-uuid-B",
          "target": "node-uuid-A",
          "version": 3,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-25T10:20:00Z"
        }
      }
    ],
    "nodes": [ // Side effects
      {
        "op": 2,                      // History operation type NODE_STATUS=2
        "before": {
          "id": "node-uuid-A",
          "status": 3,                // Completed=3
          "version": 5
        },
        "after": {
          "id": "node-uuid-A",
          "status": 2,                // Blocked=2
          "version": 6,
          "shareRoots": ["root-uuid-1"],
          "lastEditedTime": "2025-09-25T10:15:00Z"
        }
      },
      {
        "op": 2,                      // History operation type NODE_STATUS=2
        "before": {
          "id": "node-uuid-B",
          "status": 2,                // Blocked=2
          "version": 10
        },
        "after": {
          "id": "node-uuid-B",
          "status": 1,                // Available=1
          "version": 11,
          "shareRoots": ["root-uuid-2"],
          "lastEditedTime": "2025-09-25T10:15:00Z"
        }
      }
    ],
    "user": [],
    "access": [],
  }
}
```

---

## WebSocket API

**Event:** `link:swap`  
**Rate limit:** 30 requests / 10s per user  

### Client → Server

```json
{
  "id": "<uuid>"   // required, link id
}
```

### Success Ack

```json
{
  "ok": true,
  "diff": { "links": [...], "nodes": [...] },
  "trace_id": "abcd1234efgh"
}
```

### Error Ack

```json
{
  "ok": false,
  "error": "bad_request" | "forbidden" | "not_found" | "conflict" | "internal.exception",
  "message": "<optional>",
  "trace_id": "abcd1234efgh"
}
```
**Errors:** see **[error codes](/api/error-codes)**


## Examples

### JavaScript (fetch)
```js
async function swapLink(apiBaseUrl, apiToken, linkId) {
  const resp = await fetch(`${apiBaseUrl}/link/swap`, {
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
    throw new Error(`Link swap failed: ${resp.status} ${err.error || ''}`);
  }

  return resp.json();
}

// usage
swapLink('https://synaptask.space/api', '<YOUR_API_TOKEN>', 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
  .then(data => console.log('Swapped link diff:', data.diff))
  .catch(console.error);
```

### Python (requests)
```py
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

resp = requests.post(
    f"{API_BASE}/link/swap",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    },
    json={"id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"}
)

if resp.status_code != 200:
    try:
        err = resp.json()
    except Exception:
        err = {}
    raise RuntimeError(f"Link swap failed: {resp.status_code} {err}")

data = resp.json()
print("Swapped link diff:", data["diff"])
```

See also [Link concept](../../../concepts/links.md) and [History concept](../../../concepts/history.md)