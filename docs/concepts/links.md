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
- **private**: bool (`true` if visible only for owner; `false` if visible for everyone has access)
- **wasBlocker**: bool (auto becomes true once on primary links when source blocks target; auto becomes false once type turn into secondary or target status turns into Complited)
- **inTrash**: bool
- **version**: integer (for history guard)
- **createdTime**: utc timestamp
- **lastEditedTime**: utc timestamp

## Link ACL autochange rules
### Type
* `1` **secondary** will not affected.
* `0` **primary** expected changes to:
    |   Source⇩\Target⇨   |   Owner   |   Admin   |   Editor  |   Viewer
    | -------------------- | --------- | --------- | --------- | ---------
    |    **Owner**         | *primary* | *primary* | *primary* | secondary
    |    **Admin**         | *primary* | *primary* | *primary* | secondary
    |    **Editor**        | *primary* | *primary* | *primary* | secondary
    |    **Viewer**        | *primary* | *primary* | *primary* | secondary

### Privacy
* `private=true` **private** will not affected.
* `private=false` **global** expected changes to:
    |   Source⇩\Target⇨   |   Owner   |   Admin   |   Editor  |   Viewer
    | -------------------- | --------- | --------- | --------- | ---------
    |   **Owner**          | *global* | *global*  | *global*  | private
    |   **Admin**          | *global* | *global*  | *global*  | private
    |   **Editor**         | *global* | *global*  | *global*  | private
    |   **Viewer**         | *global* |  private  |  private  | private

## Active links
A link is considered active only if:
- Not `InTrash`
- Both source and target are visible

## Usage
- Links define branches.
- Branch access (when node shared as branch) means visibility expands downstream through links.

See also: [Nodes](./nodes) and [History](./history).
