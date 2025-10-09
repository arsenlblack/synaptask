---
title: history:redo
slug: /api/ws/history/redo
---

Redo a previously undone history batch via WebSocket.  
Equivalent to [POST /api/history/redo](/api/rest/history/redo) in REST.

Each redo re-applies the operations from the batch that was previously undone.  
The undone batch is linked to the redo batch via `RedoOf` / `RedoneBy`.

#### Rate limits
* Maximum **3 redo requests per 10 seconds per user.**

---

### Client → Server `history:redo`
```json
{
  "batchId": "f1b4232e-7c9f-4c12-9f0a-17cc0012a511"
}
```

#### Parameters:
* `batchId` *(UUID, required)* — identifier of the undone batch to redo.  
  Must refer to a batch that was previously undone by this user.

---

### Success (ack)
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
  },
  "trace_id": "b9c72e551bfa"
}
```

#### Field reference
| Field | Description |
|-------|--------------|
| `batchId` | ID of the newly created *redo* batch |
| `redoOf` | ID of the undone batch being redone |
| `diff` | Diff re-applied to client state |
| `trace_id` | Internal diagnostic identifier for tracing |

---

### Error (ack)
```json
{
  "ok": false,
  "error": "conflict.not_undone",
  "message": "Batch is not in undone state",
  "trace_id": "b9c72e551bfa"
}
```

**Errors:**
| Code | Meaning |
|------|----------|
| `bad_request.missing_batchId` | Missing required field |
| `not_found.batch` | Batch not found or inaccessible |
| `conflict.not_undone` | Batch is not in undone state |
| `forbidden.access_denied` | User lacks permission |
| `internal.exception` | Internal server error |

---

### Example (JavaScript)
```js
socket.emit("history:redo", { batchId: "f1b4232e-7c9f-4c12-9f0a-17cc0012a511" }, (ack) => {
  if (!ack.ok) return console.error("Redo failed:", ack);
  console.log("Redo successful, new batch:", ack.batchId);
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
    sio.emit("history:redo", {"batchId": "<uuid>"}, callback=lambda ack: print("ACK:", ack))

sio.connect("https://synaptask.space",
            headers={"Authorization": "Bearer <API_TOKEN>"},
            transports=["websocket"])
sio.wait()
```

See also [history:undo](/api/ws/batch_undo)
