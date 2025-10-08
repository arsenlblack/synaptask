---
title: DELETE /api/node/embed
slug: /api/rest/node/unembed
---

Remove a previously embedded public branch from the user's personal graph. Equivalent to [node:unembed](/api/ws/node/unembed).

## Behavior

* Removes an embedded node/branch from the current user's graph.
* Caller must be authenticated.
* The branch must be currently embedded by this user.

**Endpoint:** `DELETE /api/node/embed`  
**Auth:** API token  
**Rate limit:** 300 requests per minute

**Request body:**
```json
{
  "id": "<uuid>"    // required, ID of embedded public node or branch
}
```

**200 OK**
```json
{
  "ok": true,
  "diff": {
    "user": [
      {
        "op": 30,         // USER_UPDATE=30
        "before": {
          "publicEmbed": "uuid-branch-id"
        },
        "after": {
          "publicEmbed": null
        }
      }
    ]
  }
}
```

**Errors:** see **[error codes](/api/error-codes)**

## Example (JavaScript)
```js
const API_BASE = 'https://synaptask.space/api';
const API_TOKEN = '<YOUR_API_TOKEN>';

async function unembedNode(id) {
  const resp = await fetch(`${API_BASE}/node/embed`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  });

  const data = await resp.json();
  if (!resp.ok || !data.ok) {
    throw new Error(`Unembed failed: ${data.error || resp.statusText}`);
  }

  console.log('Node unembed diff:', data.diff);
}

unembedNode('uuid-node-id')
  .catch(console.error);
```

## Example (Python)
```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

payload = {"id": "uuid-branch-id"}
resp = requests.delete(
    f"{API_BASE}/node/embed",
    headers={"Authorization": f"Bearer {API_TOKEN}", "Content-Type": "application/json"},
    json=payload
)
print(resp.json())
```

See also [Node concept](../../../concepts/nodes.md) and [Account concept](../../../concepts/account.md)