---
title: Nodes
slug: /concepts/nodes
---

Nodes are the fundamental units in SynapTask — tasks, cards, documents, or ideas represented in 3D space.

## Properties
- **id**: unique UUID
- **title**: short string
- **description**: string
- **status**: integer (0=Available; 1=InProgres; 2=Blocked - auuto change, when at least 1 child node, connected with primary link, have status not 3; 3=Complted)
- **dueDate**: optional timestamp
- **type**: integer (custom type/category)
- **tags**: string (comma-separated)
- **volume**: integer (visual size, i`m using for mark priority)
- **version**: integer (incremented on changes for history guard)
- **asignee**: json (list of names, mails or usernames)
- **createdTime**: utc timestamp
- **lastEditedTime**: utc timestamp
- **ownerUsername**: short string
- **ownerEmail**: short string
- **PublicToken**: short string (for public sharing in https://synaptask.space/branch/{PublicToken})
- **x**: float (x coordinate in graph space)
- **y**: float (y coordinate in graph space)
- **z**: float (z coordinate in graph space)
- **pinned**: bool, whether graph physics will affect coordinates
- **collapsed**: json, whether the entire downstream branch will be shown in graph
- **access**: integer (0=owner, 1=admin, 2=editor, 3=viewer)



## Lifecycle
- Created by a user.
- Can be updated, moved, trashed, or purged.
- Visible to owner and any collaborators with access.

See also: [Accesses](./accesses.md) for sharing nodes.
