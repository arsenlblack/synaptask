---
title: POST /api/node/restore
slug: /api/rest/node/restore
---

Restore a node from the **trash**. Equivalent to [node:restore](/api/ws/node/restore) in WebSocket.

## Visibility & Permissions

* User must have **editor** access to the node.  
  - If ACL check fails → `forbidden` error.
* Node must already be in **trash**.  
  - If not trashed → `not_trashed_node` error.

---

### Request

**Endpoint**  
`POST /api/node/restore`

**Payload (JSON)**

```json
{
  "id": "<uuid>"    // required, node id
}
```

---

### Success (200)

```json
{
  "ok": true,
  "diff": {
    "batchId": "uuid",
    "actor": {
      "username": "alice",
      "email": "alice@example.com"
    },
    "ts": "2025-09-25T11:00:00Z",
    "nodes": [
      {
        "op": 4,   // NODE_RESTORE=4
        "before": {
          "id": "uuid",
          "inTrash": true,
          "version": 4
        },
        "after": {
          "id": "uuid",
          "inTrash": false,
          "version": 5,
          "lastEditedTime": "2025-09-25T11:00:00Z",
          "shareRoots": ["uuid1", "uuid2"]
        }
      },
      {  // side effect
        "op": 2,          // NODE_STATUS=2
        "before": {
          "id": "uuid",
          "Status": 1,                // Node status Available=1
          "version": 4
        },
        "after": {
          "id": "uuid",
          "Status": 2,                // Node status Blocked=2
          "version": 5,
          "lastEditedTime": "2025-09-25T11:00:00Z",
          "shareRoots": ["uuid1", "uuid2"]
        }
      }
    ],
    "links": [
      {  // side effect
        "op": 13,                            // History operation type LINK_RESTORE=13
        "before": {
          "id": "uuid",
          "inTrash": true,
          "version": 4
        },
        "after": {
          "id": "uuid",
          "version": 5,
          "inTrash": false,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-13T10:00:00Z"
        }
      },
      {  // side effect
        "op": 13,                            // History operation type LINK_RESTORE=13
        "before": {
          "id": "uuid2",
          "inTrash": true,
          "version": 8
        },
        "after": {
          "id": "uuid2",
          "inTrash": false,
          "version": 9,
          "shareRoots": ["root-uuid-1", "root-uuid-2"],
          "lastEditedTime": "2025-09-13T10:00:00Z"
        }
      }
    ],
    "user": [],
    "access": [],
  }
}
```

:::info
The diff contains the restored node and any side effects  
(e.g. links automatically restored when parent node is restored).  
Consumers must merge diffs by `id+version`, not overwrite blindly.
:::

---

### Error Responses

```json
{
  "ok": false,
  "error": "bad_request" | "forbidden" | "not_found" | "conflict" | "internal.exception",
  "message": "<optional human-readable>"
}
```

**Errors:** see **[error codes](/api/error-codes)**

---

## Examples

### JavaScript (fetch)

```js
async function restoreNode(nodeId) {
  const resp = await fetch("https://synaptask.space/api/node/restore", {
    method: "POST",
    headers: {
      "Authorization": "Bearer <API_TOKEN>",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: nodeId })
  });

  const data = await resp.json();
  if (data.ok) {
    console.log("Node restored:", data.diff);
  } else {
    console.error("Restore failed:", data.error, data.message);
  }
}

restoreNode("f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
```

### Python (requests)

```python
import requests

url = "https://synaptask.space/api/node/restore"
headers = {"Authorization": "Bearer <API_TOKEN>"}
payload = {"id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"}

resp = requests.post(url, json=payload, headers=headers)
data = resp.json()

if data.get("ok"):
    print("Node restored:", data["diff"])
else:
    print("Failed:", data["error"], data.get("message"))
```

See also [Node concept](../../../concepts/nodes.md) and [Trash concept](../../../concepts/trash.md)