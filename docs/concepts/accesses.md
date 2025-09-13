---
title: Accesses
slug: /concepts/accesses
---

Access rules define who can see and interact with nodes.

## Model
- **Granted by**: username (user@email.com)
- **Granted to**: username (user@email.com)
- **Shared node**: Title
- **Level**: admin, editor, viewer
- **As branch**: whether the entire downstream branch is granted

## Rules
- Multiple grants can exist; the **highest privilege wins** (lowest Level value).
- Access can be revoked by removing the record or setting Showing = false.
- Basic plan allows only 3 Showing = true accesses.

See also: [History](./history.md) for audit trail of access changes.
