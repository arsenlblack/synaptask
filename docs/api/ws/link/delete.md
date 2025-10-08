---
title: link:delete
slug: /api/ws/link/delete
---

Delete a link between two nodes via WebSocket. Equivalent to [DELETE /api/link](/api/rest/link/delete) in REST.

## Behavior

* Purges **permanently** link from trash.
* Link must be in trash.
* Only **owner** can purge.

## Rate Limits
* `30 / 10s` per user.

### Client → Server (`link:delete`)
Request to delete an existing link.

```json
{
  "id": "uuid"
}
```

* `id` — ID of the link to delete (string, required).

#### Success (ack)

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
        "op": 13,           // LINK_DELETE=13
        "before": {
          "id": "uuid",
          "source": "node-uuid-A",
          "target": "node-uuid-B",
          "type": 0,
          "wasBlocker": true,
          "version": 3,
          "shareRoots": ["root-uuid-1"]
        },
        "after": {
          "id": "uuid",
          "deleted": true,
          "shareRoots": ["root-uuid-1"]
        }
      }
    ],

    "nodes": [],
    "user": [],
    "access": [],
  }
}
```

### Broadcasting (`graph:diff`)
> On success, the server emits `"graph:diff"` to other clients in the relevant rooms.  
> The own client only receives the ACK and is excluded from this event.

#### Error (ack)

```json
{
  "ok": false,
  "error": "forbidden" | "internal" | "not_found"
       | "bad_request" | "conflict" | "rate_limited",
  "message": "<optional>",
  "trace_id": "abcd1234efgh"
}
```

**Errors:** see **[error codes](/api/error-codes)**

:::info
Each error is namespaced for clarity, e.g. `bad_request.invalid_uuid`.
:::

## Example (JavaScript)

```js
// Delete a link by ID
socket.emit("link:delete", { id: "789" }, (ack) => {
  if (ack.ok) {
    console.log("Link deleted:", ack.diff.links);
  } else {
    console.error("Link deletion failed:", ack.error, ack.message);
  }
});

// Listen for graph updates
socket.on("graph:diff", (diff) => {
  console.log("Graph updated:", diff);
});
```

## Example (Python)

```python
import socketio

API_URL = "https://synaptask.space"
API_TOKEN = "<YOUR_API_TOKEN>"

sio = socketio.Client()

@sio.event
def connect():
    print("connected:", sio.sid)
    sio.emit("link:delete", {"id": "789"}, callback=on_link_ack)

def on_link_ack(ack):
    if ack.get("ok"):
        print("Link deleted:", ack["diff"]["links"])
    else:
        print("Deletion failed:", ack["error"], ack.get("message"))
    sio.disconnect()

sio.connect(API_URL, auth={"api_token": API_TOKEN}, transports=["websocket"])
sio.wait()
```

See also [Link concept](../../../concepts/links.md)