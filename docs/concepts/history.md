---

title: History
slug: /concepts/history
---

History in SynapTask provides **undo/redo** and **auditing** for all graph changes.

## Behavior

* Each mutation creates a **batch** (a set of operations).
* Each batch stores:
  * `forward` — the applied changes.
  * `inverse` — the reverse changes (for undo).
* **Undo** applies the `inverse`.
* **Redo** re-applies a previously saved batch.

## Retention

The length and size of retained history depend on the subscription plan:

* **Basic**: 1 day • 100 actions • 20 MB
* **Plus**: 30 days • 5,000 actions • 200 MB
* **Pro**: 180 days • 50,000 actions • 800 MB

## Use cases

* Undo accidental node deletion.
* Redo a branch merge.
* Audit collaborator changes.



## Operation Types

All operations are stored as integers `int`.

### ScopeType

Defines the **visibility boundary** of a history batch:

* `0 = USER` — private user actions only.
* `1 = GRAPH` — changes in the graph (nodes/links).
* `2 = PAGE` — content/page updates.

---

### EntityType

The entity family for the operation:

* `0 = NODE` — graph node (task/item).
* `1 = LINK` — graph link (edge).
* `2 = GRANT` — access grants.
* `3 = USER` — user-level settings.

---

### Operation types

Operation codes across all entity types:

* `0 = NODE_ADD`
* `1 = NODE_UPDATE`
* `2 = NODE_STATUS`
* `3 = NODE_TRASH`
* `4 = NODE_RESTORE`
* `5 = NODE_DELETE`
* `6 = NODE_PUBLISH`
* `10 = LINK_ADD`
* `11 = LINK_TYPE`
* `12 = LINK_UPDATE`
* `13 = LINK_TRASH`
* `14 = LINK_RESTORE`
* `15 = LINK_DELETE`
* `16 = LINK_SWAP`
* `20 = GRANT_UPSERT`
* `21 = GRANT_UPDATE`
* `22 = GRANT_DELETE`
* `30 = USER_UPDATE`
* `40 = PAGE_UPDATE`

---

## Example Batch JSON

```json
{
  "batchId": "uuid",
  "actor": {
      "username": "alice",
      "email": "alice@example.com"
  }
  "ts": "2025-09-25T12:00:00Z",
  "nodes": [
    {
      "op": 0, // NODE_ADD
      "before": {},
      "after": {
        "ID": "node-uuid",
        "Title": "New task",
        "Status": 0,
        "Version": 1
      }
    },
    {
      "op": 3, // NODE_TRASH
      "before": {"ID": "other-node", "InTrash": false, "Version": 2},
      "after": {"ID": "other-node", "InTrash": true, "Version": 3}
    }
  ],
  "links": [
    {
      "op": 11, // LINK_UPDATE
      "before": {"ID": "link-uuid", "WasBlocker": false, "Version": 1},
      "after": {"ID": "link-uuid", "WasBlocker": true, "Version": 2}
    }
  ],
  "user": [],
  "access": [],
}
```

---

This structure allows to:

* Display audit trails.
* Support undo/redo on the client side.
* Build advanced collaboration views with full diff history.
