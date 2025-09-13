---
title: Links
slug: /concepts/links
---

Links connect two nodes in the graph.

## Properties
- **id**: UUID
- **source**: NodeID (from, children, subtask)
- **target**: NodeID (to, parent, supertask)
- **type**: integer (0=primary, 1=secondary)
- **wasBlocker**: bool (auto becomes true once on primary links when source blocks target; auto becomes false once type turn into secondary or target status turns into Complited)
- **InTrash**: bool
- **version**: integer (for history guard)
- **createdTime**: utc timestamp
- **LastEditedTime**: utc timestamp

## Active links
A link is considered active only if:
- Not `InTrash`
- Both source and target are visible

## Usage
- Links define branches.
- Branch access (`Accesses.Branch = true`) means visibility expands downstream through links.

See also: [Nodes](./nodes.md) and [Accesses](./accesses.md).
