---
title: POST /api/history/redo
slug: /api/rest/history/redo
---

Redo a previously undone batch of operations.  
Equivalent to [batch:redo](/api/ws/history/redo) in WebSocket.

**Endpoint:** `POST /api/history/redo`  
**Auth:** Bearer API token (`Authorization: Bearer <token>`)  
**Rate limit:** 300 requests per minute

---

### Request body
```json
{
  "batchId": "f1b4232e-7c9f-4c12-9f0a-17cc0012a511"
}
```

#### Parameters:
* `batchId` *(UUID, required)* — identifier of the undone batch to redo.

---

### 200 OK
```json
{
  "ok": true,
  "batchId": "d2a77b31-21c5-4f9b-99ce-41078551df33",
  "redoOf": "f1b4232e-7c9f-4c12-9f0a-17cc0012a511",
  "diff": {
    "nodes": [
      { "id": "uuid", "title": "Restored title", "version": 6 }
    ],
    "links": []
  }
}
```

---

### 4xx / 5xx Error
```json
{
  "ok": false,
  "error": "conflict.not_undone",
  "message": "Batch is not in undone state"
}
```

**Errors:** see **[error codes](/api/error-codes)**

---

### Example (JavaScript)
```js
const resp = await fetch("https://synaptask.space/api/history/redo", {
  method: "POST",
  headers: {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ batchId: "<uuid>" })
});
const data = await resp.json();
console.log("Redo response:", data);
```

---

### Example (Python)
```python
import requests

resp = requests.post(
    "https://synaptask.space/api/history/redo",
    headers={"Authorization": "Bearer <token>"},
    json={"batchId": "<uuid>"},
)
print(resp.json())
```

See also [Undo](/api/rest/history/undo)
