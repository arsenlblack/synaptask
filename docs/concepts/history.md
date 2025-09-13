---
title: History
slug: /concepts/history
---

History in SynapTask provides undo/redo and auditing.

## Entities
- **HistoryBatch**: groups a set of operations (scope user or branch).
- **HistoryOp**: single atomic change (node, link, grant, user).

## Behavior
- Each mutation creates a batch with forward & inverse patches.
- Undo re-applies inverse patches.
- Redo references a prior batch.

## Retention
Depends on subscription plan:
- Basic: 1 day • 100 actions • 20 MB
- Plus: 30 days • 5,000 actions • 200 MB
- Pro: 180 days • 50,000 actions • 800 MB

## Use cases
- Undo accidental node deletion.
- Redo a branch merge.
- Audit changes by collaborators.
