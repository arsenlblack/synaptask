---
title: Fetch Graph
slug: /guides/fetch-graph
---

This guide shows how to retrieve your graph using both REST and WebSocket.

## REST

Endpoint:
```
GET /api/graph
```

- Requires API token.
- Returns accessible nodes and links.

Example:
```bash
curl -X GET https://synaptask.space/api/graph \
  -H "Authorization: Bearer <ACCESS_JWT>"
```

## WebSocket

Client → Server:
```
graph:get
```

Server → Client:
```
graph:init {nodes, links}
```

### Best Practice
- On connect, wait up to 3 seconds for `graph:init`.
- If no response, fallback to REST once.
- Always handle `graph:error` gracefully.

See also: [Concepts: Nodes](../concepts/nodes.md)
