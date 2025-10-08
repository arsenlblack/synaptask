---
title: POST /api/node/embed
slug: /api/rest/node/embed
---

Embed a public node/branch into the user's personal graph. Equivalent to [node:embed](/api/ws/node/embed) via WebSocket.

## Behavior

* Embeds an existing public branch into the current user's personal graph.
* The target branch must be public.
* Expired or revoked public branches cannot be embedded.


**Endpoint:** `POST /api/node/embed`  
**Auth:** API token  
**Rate limit:** 300 requests per minute

**Request body:**
```json
{
  "id": "<uuid>"    // required, ID of public node or branch
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
          "publicEmbed": null
        },
        "after": {
          "publicEmbed": "uuid-branch-id"
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

async function embedNode(id) {
  const resp = await fetch(`${API_BASE}/node/embed`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  });

  const data = await resp.json();
  if (!resp.ok || !data.ok) {
    throw new Error(`Embed failed: ${data.error || resp.statusText}`);
  }

  console.log('Node embed diff:', data.diff);
}

embedNode('uuid-node-id')
  .catch(console.error);
```

## Example (Python)
```python
import requests

API_BASE = "https://synaptask.space/api"
API_TOKEN = "<YOUR_API_TOKEN>"

payload = {"id": "uuid-branch-id"}
resp = requests.post(
    f"{API_BASE}/node/embed",
    headers={"Authorization": f"Bearer {API_TOKEN}", "Content-Type": "application/json"},
    json=payload
)
print(resp.json())
```

See also [Node concept](../../../concepts/nodes.md) and [Account concept](../../../concepts/account.md)