---
title: POST /api/history/undo
slug: /api/rest/history/undo
---

Undo a previously executed batch of operations.  
Equivalent to [batch:undo](/api/ws/history/undo) in WebSocket.

**Endpoint:** `POST /api/history/undo`  
**Auth:** Bearer API token (`Authorization: Bearer <token>`)  
**Rate limit:** 300 requests per minute

---

### Request body
```json
{
  "batchId": "b8e0c4cb-8ab7-4b2e-91cd-8fd92e1b9a20"
}
```

#### Parameters:
* `batchId` *(UUID, required)* — identifier of the batch to undo.

---

### 200 OK
```json
{
  "ok": true,
  "batchId": "f1b4232e-7c9f-4c12-9f0a-17cc0012a511",
  "undoOf": "b8e0c4cb-8ab7-4b2e-91cd-8fd92e1b9a20",
  "diff": {
    "nodes": [
      { "id": "uuid", "title": "Old title", "version": 5 }
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
  "error": "conflict.already_undone",
  "message": "Batch has already been undone"
}
```
**Errors:** see **[error codes](/api/error-codes)**

---

### Example (JavaScript)
```js
const resp = await fetch("https://synaptask.space/api/history/undo", {
  method: "POST",
  headers: {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ batchId: "<uuid>" })
});
const data = await resp.json();
console.log("Undo response:", data);
```

---

### Example (Python)
```python
import requests

resp = requests.post(
    "https://synaptask.space/api/history/undo",
    headers={"Authorization": "Bearer <token>"},
    json={"batchId": "<uuid>"},
)
print(resp.json())
```

See also [Redo](/api/rest/history/redo)
