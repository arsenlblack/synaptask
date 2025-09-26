---
title: POST /api/link
slug: /api/rest/post_link
---

Create a new link between two nodes.

## Behavior

* A link represents a dependency between nodes.
* `type`:
  * `0` → primary link (blocking): source blocks target.
  * `1` → secondary link (non-blocking).
* ACL:
  * For **secondary links**, caller must have at least **editor** access to source and **viewer** access to target.
  * For **primary links**, caller must have at least **editor** access on both.
* History batch records link creation and all side effects (e.g., cascading blocking of ancestors).

## REST API

**Endpoint:** `POST /api/link`
**Auth:** API token
**Rate limit:** `30/minute`

**Request body:**

```json
{
  "source": "<uuid>",   // source node id
  "target": "<uuid>",   // target node id
  "type": 0              // 0 = primary, 1 = secondary
}
```

**200 OK**

```json
{
  "ok": true,
  "diff": {
    "links": [
      {
        "id": "uuid",
        "source": "nodeId",
        "target": "nodeId",
        "type": 0,
        "wasBlocker": true,
        "version": 0
      }
    ],
    "nodes": [
      { // if blocking cascaded
        "id": "uuid",
        "status": 2,
        "version": 5,
        "shareRoots": ["root-uuid-1", "root-uuid-2"]
      }
    ]
  }
}
```
* `links` — the created or updated link(s).
* `nodes` — any nodes affected by cascade blocking (if primary link).

**Errors:** 
* `bad_request` (400),
* `unauthorized` (401),
* `forbidden` (403),
* `not_found` (404),
* `conflict` (409),
* `rate_limited` (429),
* `internal.exception` (500).

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
