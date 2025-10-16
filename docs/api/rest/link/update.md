---
title: PUT /api/link
slug: /api/rest/link/update
---

Update an existing link between two nodes. Equivalent to [link:update](/api/ws/link/update) in WebSocket.

## Behavior

* Only certain link attributes can be updated (currently `type`).
* History batch records link update and all side effects (e.g., cascade unblock).
* `type`:
  * `1` → secondary link (non-blocking).
  * `0` → primary link (blocking): source blocks target.  
    Not allowed if caller has **viewer** or lower access for `target` node.
* `private`:
  * `true` → visible only for owner.
  * `false` → visible for everyone.
  
  Changing allowed according to the ACL rules:
  | Source⇩\Target⇨|   Owner |    Admin    |    Editor   |   Viewer
  | --------------- | ------- | ----------- | ----------- | ---------
  |  **Owner**      | allowed |   allowed   |   allowed   | *forbidden*
  |  **Admin**      | allowed |   allowed   |   allowed   | *forbidden*
  |  **Editor**     | allowed |   allowed   |   allowed   | *forbidden*
  |  **Viewer**     | allowed | *forbidden* | *forbidden* | *forbidden*

## REST API

**Endpoint:** `PUT /api/link`  
**Auth:** API token  
**Rate limit:** 300 requests per minute  

**Request body:**

```json
{
  "id": "<uuid>",      // link id
  "type": 1,
  "private": true
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
        "op": 11,                           // History operation type LINK_UPDATE=11
        "before": {
          "id": "uuid",
          "type": 0,
          "private": false,
          "version": 1
        },
        "after": {
          "id": "uuid",
          "type": 1,
          "private": true,
          "version": 2,
          "shareRoots": ["root-uuid-1"],
          "lastEditedTime": "2025-09-25T10:15:00Z"
        }
      }
    ],

    "nodes": [ // Cascade unblocking of a target
      {
        "op": 2,                            // History operation type NODE_STATUS=2
        "before": {
          "id": "uuid",
          "status": 2,                // Blocked=2
          "version": 5
        },
        "after": {
          "id": "uuid",
          "status": 1,                // Available=1
          "version": 6,
          "shareRoots": ["root-uuid-1"],
          "lastEditedTime": "2025-09-25T10:15:00Z"
        }
      }
    ],
    "user": [],
    "access": [],
  }
}
```

* `links` — updated link.  
* `nodes` — any nodes affected by cascade unblock (if link changed from primary to secondary).  

**Errors:** see **[error codes](/api/error-codes)**

## Example (JavaScript)

```js
async function updateLink(apiBaseUrl, apiToken, linkId, newType = 1) {
  const resp = await fetch(`${apiBaseUrl}/link`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ id: linkId, type: newType })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(`Link update failed: ${resp.status} ${err.error || ''}`);
  }

  return resp.json();
}

// usage
updateLink('https://synaptask.space/api', '<YOUR_API_TOKEN>', 'link-uuid', 1)
  .then(data => console.log('Updated link diff:', data.diff))
  .catch(console.error);
```

## Example (Python)

```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

resp = requests.put(
    f"{API_BASE}/link",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    },
    json={"id": "link-uuid", "type": 1}
)

if resp.status_code != 200:
    try:
        err = resp.json()
    except Exception:
        err = {}
    raise RuntimeError(f"Link update failed: {resp.status_code} {err}")

data = resp.json()
print("Updated link diff:", data["diff"])
```

See also [Link concept](../../../concepts/links.md) and [History concept](../../../concepts/history.md)
