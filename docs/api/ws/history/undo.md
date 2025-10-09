---
title: history:undo
slug: /api/ws/history/undo
---

Undo a previously executed history batch via WebSocket.  
Equivalent to [POST /api/history/undo](/api/rest/history/undo) in REST.

Each undo creates a new batch containing the inverse operations of the original one.  
The original batch becomes marked as `undone`, and a new batch is linked via `UndoOf` / `UndoneBy`.

#### Rate limits
* Maximum **3 undo requests per 10 seconds per user.**

---

### Client → Server `history:undo`
```json
{
  "batchId": "b8e0c4cb-8ab7-4b2e-91cd-8fd92e1b9a20"
}
```

#### Parameters:
* `batchId` *(UUID, required)* — identifier of the batch to undo.  
  Must be visible to the current user and not already undone.

---

### Success (ack)
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
  },
  "trace_id": "af2b3d44c7b2"
}
```

#### Field reference
| Field | Description |
|-------|--------------|
| `batchId` | ID of the newly created *undo* batch |
| `undoOf` | ID of the original batch being undone |
| `diff` | Actual inverse diff applied to client state |
| `trace_id` | Internal diagnostic identifier for tracing requests |

---

### Error (ack)
```json
{
  "ok": false,
  "error": "conflict.already_undone",
  "message": "Batch has already been undone",
  "trace_id": "af2b3d44c7b2"
}
```
**Errors:** see **[error codes](/api/error-codes)**

---

### Example (JavaScript)
```js
socket.emit("history:undo", { batchId: "b8e0c4cb-8ab7-4b2e-91cd-8fd92e1b9a20" }, (ack) => {
  if (!ack.ok) return console.error("Undo failed:", ack);
  console.log("Undo successful, new batch:", ack.batchId);
});
```

---

### Example (Python)
```python
import socketio

sio = socketio.Client()

@sio.event
def connect():
    print("connected")
    sio.emit("batch:undo", {"batchId": "<uuid>"}, callback=lambda ack: print("ACK:", ack))

sio.connect("https://synaptask.space",
            headers={"Authorization": "Bearer <API_TOKEN>"},
            transports=["websocket"])
sio.wait()
```

See also [history:redo](/api/ws/batch_redo)
