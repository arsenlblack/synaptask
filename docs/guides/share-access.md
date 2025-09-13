---
title: Share Access
slug: /guides/share-access
---

How to share a node with another user.

## REST

Endpoint:
```
POST /api/access
```

Body:
```json
{
  "nodeId": "uuid-of-node",
  "grantedTo": "user@email.com",
  "level": 2,
  "branch": true
}
```

## WebSocket

Client → Server:
```
access:grant {nodeId, grantedTo, level, branch}
```

Server → Client:
- `access:granted {access}` on success
- `access:error {error}` on failure

## Rules
- Lowest level number wins (1=admin, 2=editor, 3=view).
- `branch=true` makes downstream nodes visible.

See also: [Concepts: Accesses](../concepts/accesses.md)
