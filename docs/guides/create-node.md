---
title: Create Node
slug: /guides/create-node
---

This guide explains how to create a new node.

## REST

Endpoint:
```
POST /api/nodes
```

Body:
```json
{
  "super": "836d923b-9065-11f0-ba44-0a3bfec55a9f", // optional, will create link to it if specified (source)new -> super(target)
  "status": 0, // optional, 0=Avaliable, 1=InProgres, 3=Completed
  "title": "My Task", // optional, max 128 chars
  "volume": 5, // optional
  "dueDate": "2025-10-17T07:44", // optional, isoformat
  "tags": "my,red,locker", // optional
}
```

Response:
```json
{ "ok": true, "node": { "id": "bf6120d3-b97e-436d-a10b-5d26ec589fcf", ... } }
```

## WebSocket

Client → Server:
```
node:create {title, description, status, priority}
```

Server → Client:
- `node:created {node}` on success
- `node:error {error}` on failure

