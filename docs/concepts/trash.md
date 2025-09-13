---
title: Trash
slug: /concepts/nodes
---

The **Trash** is a temporary storage area for nodes and links that have
been removed by a user but not yet permanently deleted.\
It provides a safety net against accidental deletions and allows
recovery until the user explicitly chooses to **Empty Trash**.

------------------------------------------------------------------------

## Lifecycle of Items

1.  **Move to Trash**
    -   When a node or link is deleted by the user, it is placed into
        Trash.\
    -   It is hidden from the active workspace but can still be
        restored.
2.  **Restore from Trash**
    -   Items in Trash can be restored at any time.\
    -   Once restored, they reappear in the workspace at their last
        known place.
3.  **Permanent Delete**
    -   When the user empties the Trash or deletes a trashed item
        permanently, it is **irreversibly removed** from the system.\
    -   All related data (such as links and layouts) are also cleared.

------------------------------------------------------------------------

## Access & Permissions

-   **Owner and admin operation**:\
    Only the owner and granted admin of a node or link can move it to Trash or restore it.
    Only the owner can permanently delete it.

-   **Shared visibility**:\
    If an owner moves a node to Trash:

    -   It disappears from all collaborators' views but admin view.\
    -   Any links connected to it are moved to trash as well.

------------------------------------------------------------------------

## API Behavior

-   Graph queries (`graph:get`, `/api/graph`) **never include trashed
    items**.\
-   Dedicated endpoints and events:
    -   `trash:list` → list items currently in Trash.\
    -   `trash:restore` → restore an item by ID.\
    -   `trash:purge` → permanently delete item by ID.\
    -   `trash:empty` → permanently delete all items in Trash.

------------------------------------------------------------------------

## Limits & Considerations

-   **Storage impact**: Items in Trash still occupy space until
    permanently deleted.\
-   **Consistency**: Restoring an item also restores its valid
    connections. Connections to already removed nodes remain discarded.\
-   **Security**: Items in Trash remain private to the owner; no new
    sharing can be applied to trashed items.

------------------------------------------------------------------------

📌 **Summary**:\
Trash provides a reversible safety layer between normal use and
permanent deletion. It protects against mistakes, while still ensuring
users can clean up and optimize their workspace.
