---
title: node:unembed
slug: /api/rest/node/unembed
---

Remove a previously embedded public branch from the user's personal graph. Equivalent to [DELETE /api/node/embed](/api/rest/node/unembed) in REST.

## Behavior

* Removes an embedded branch from the current user's graph.
* The branch must be currently embedded by this user.

### Client → Server `node:unembed`

```json
{
  "id": "<uuid>"
}
```

**Ack**
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

## Example (JavaScript)
```js
socket.emit("node:unembed", { id: "<uuid>" }, (resp) => {
  if (resp.ok) console.log("Unembedded:", resp.diff);
});
```

## Example (Python)
```python
import socketio

sio = socketio.Client()
sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <API_TOKEN>"})

resp = sio.call("node:unembed", {"id": "<uuid>"}, timeout=5)
if resp.get("ok"):
    print("Node unembedded:", resp["diff"])
else:
    print("Unembed failed:", resp["error"])
```

See also [Node concept](../../../concepts/nodes.md) and [History concept](../../../concepts/history.md)