---
title: Accesses
slug: /concepts/accesses
---

Access rules define who can see and interact with nodes.

## Model
- **GrantedTo**: user receiving access
- **NodeID**: node shared
- **GrantedBy**: user granting
- **Level**: integer (1=admin, 2=editor, 3=view)
- **Showing**: bool, whether the node is visible in recipient’s graph
- **Branch**: bool, whether the entire downstream branch is granted
- **CreatedTime**: utc timestamp
- **LastEditedTime**: utc timestamp

## Rules
- Multiple grants can exist; the **highest privilege wins** (lowest Level value).
- Access can be revoked by removing the record or setting Showing = false.
- Basic plan allows only 3 Showing = true accesses.

See also: [History](./history.md) for audit trail of access changes.
