---
title: node:embed
slug: /api/ws/node/embed
---

Embed a public branch into the user's personal graph. Equivalent to [POST /api/node/embed](/api/rest/node/embed) in REST.

## Behavior

* Embeds an existing public branch into the current user's personal graph.
* The target branch must be public.
* Expired or revoked public branches cannot be embedded.

### Client → Server `node:embed`

```json
{
  "id": "<uuid>"   // required
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

## Example (JavaScript)
```js
socket.emit("node:embed", { id: "<uuid>" }, (resp) => {
  if (resp.ok) console.log("Embedded:", resp.diff);
});
```

## Example (Python)
```python
import socketio

sio = socketio.Client()
sio.connect("https://synaptask.space", headers={"Authorization": "Bearer <API_TOKEN>"})

resp = sio.call("node:embed", {"id": "<uuid>"}, timeout=5)
if resp.get("ok"):
    print("Node embedded:", resp["diff"])
else:
    print("Embed failed:", resp["error"])
```

See also [Node concept](../../../concepts/nodes.md) and [History concept](../../../concepts/history.md)
