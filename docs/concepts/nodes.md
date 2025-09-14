---
title: Nodes
slug: /concepts/nodes
---

Nodes are the fundamental units in SynapTask — tasks, cards, documents, or ideas represented in 3D space.

## Properties
- **id**: unique UUID
- **title**: short string
- **description**: string
- **status**: integer  
  - `0 = Available`  
  - `1 = InProgress`  
  - `2 = Blocked` — auto-set when a node has at least one child connected via a **primary link (type=0)** whose status is **not 3**  
  - `3 = Completed`
- **dueDate**: optional UTC timestamp (ISO 8601, `...Z`)
- **type**: integer (custom type/category)
- **tags**: string (comma-separated)
- **priority**: integer `0–9`
- **dependant**: boolean (whether the node can be blocked by downstream dependencies)
- **volume**: integer (visual size; also used to hint priority in layout)
- **version**: integer (increments on changes; used as history/optimistic locking guard)
- **asignee**: JSON array of strings (names, emails, or usernames), e.g. `["jane@x.com", "john"]`
- **createdTime**: UTC timestamp (ISO 8601, `...Z`)
- **lastEditedTime**: UTC timestamp (ISO 8601, `...Z`)
- **ownerUsername**: short string
- **ownerEmail**: short string
- **publicToken**: short string (for public sharing via `https://synaptask.space/branch/{publicToken}`)
- **x**: float (x coordinate in graph space)
- **y**: float (y coordinate in graph space)
- **z**: float (z coordinate in graph space)
- **pinned**: boolean — whether graph physics affect coordinates
- **collapsed**: boolean — whether the downstream branch is collapsed in the graph
- **access**: integer (ACL)  
  - `0 = owner`, `1 = admin`, `2 = editor`, `3 = viewer`



## Lifecycle
- Created by a user.
- Can be updated, moved, trashed, or purged.
- Visible to owner and any collaborators with access.

See also: [Accesses](./accesses.md) for sharing nodes.
