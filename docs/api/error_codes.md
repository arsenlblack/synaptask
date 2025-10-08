---
title: Error codes
slug: /api/error-codes
---

## General (400 / 403 / 404 / 409)

| Code | Error | Meaning |
| ---- | ----- | ------- |
| 400 | `bad_request` | Invalid request. |
| 400 | `fields_must_be_dict` | Fields must be an object (dict). |
| 400 | `invalid_limit` | Limit must be 1–5000 or omitted (default 1000). |
| 400 | `invalid_offset` | Offset must be non-negative integer. |
| 403 | `forbidden` | You don’t have permission. |
| 403 | `no_permission` | You do not have permission for this operation. |
| 404 | `batch_not_found` | History batch not found. |
| 404 | `batch_not_found_or_closed` | History batch not found or already closed. |
| 404 | `batch_empty` | History batch not found or empty. |
| 409 | `version_conflict` | Entity modified concurrently. Reload & retry. |
| 409 | `invalid_order_conflict` | Operation order conflict, please retry. |
| 409 | `batch_id_conflict` | Batch ID already exists with different metadata. |

---

## Node Errors

| Code | Error | Meaning |
| ---- | ----- | ------- |
| 400 | `invalid_node_id` | Node id must be UUID v4. |
| 404 | `node_not_found` | Node not found. |
| 400 | `immutable_field` | Tried to modify immutable field. |
| 400 | `no_fields_to_update` | Update must include at least one mutable field (besides `id`). |
| 400 | `title_too_long` | Title too long (max 80 chars). |
| 400 | `description_too_long` | Description too long (max 400 chars). |
| 400 | `invalid_status` | Invalid node status. |
| 400 | `status_blocked` | Status=2 (Blocked) is auto-generated, forbidden to set manually. |
| 400 | `node_blocked` | Can't change status for blocked node (status=2). |
| 400 | `invalid_due_datetime` | `dueDate` must be ISO8601 (e.g. `2025-09-13T10:00:00Z`). |
| 400 | `already_trashed_node` | Node already in trash. |
| 400 | `node_in_trash` | Can't edit node in trash. |
| 400 | `not_trashed_node` | Node is not in trash. |
| 400 | `cant_delete_active_node` | Cannot delete active node — move to trash first. |
| 400 | `cannot_restore_purged` | Cannot restore permanently deleted node. |
| 403 | `expand_readonly_branch` | Cannot expand read-only branch. Create node without `tgt_id` then attach via secondary link. |
| 400 | `invalid_priority` | Priority must be int 0–9. |
| 400 | `invalid_volume` | Volume must be int 0–9. |
| 400 | `volume_out_of_range` | Volume must be 0–9. |
| 400 | `invalid_dependent` | `dependent` must be boolean. |
| 400 | `invalid_pinned` | `pinned` must be boolean. |
| 400 | `invalid_collapsed` | `collapsed` must be boolean. |
| 400 | `invalid_assignee` | Assignee must be list of usernames/strings. |
| 400 | `too_many_tags` | Too many tags (max length 32). |
| 400 | `invalid_tags` | `tags` must be array of non-empty strings. |
| 400 | `tag_empty` | Tags cannot contain empty/whitespace strings. |
| 400 | `tag_too_long` | Each tag ≤ 50 chars. |
| 400 | `invalid_public_due` | Field 'due' must be a valid ISO8601 datetime string (e.g. 2025-09-13T10:00:00Z) and represent future time. |

---

## Link Errors

| Code | Error | Meaning |
| ---- | ----- | ------- |
| 400 | `invalid_link_id` | Link id must be UUID v4. |
| 404 | `link_not_found` | Link not found. |
| 404 | `source_not_found` | Source node not found. |
| 404 | `target_not_found` | Target node not found. |
| 400 | `source_in_trash` | Source node in trash. |
| 400 | `target_in_trash` | Target node in trash. |
| 400 | `inactive_source_or_target` | Source/target inactive (trashed/missing). |
| 400 | `self_link_not_allowed` | Node cannot link to itself. |
| 400 | `invalid_source_target_id` | `source` and `target` must be UUID v4. |
| 400 | `invalid_target_id` | `target` must be UUID v4 or omitted. |
| 400 | `invalid_link_snapshot` | Link snapshot invalid. |
| 400 | `invalid_link_private` | `private` must be boolean or omitted. |
| 403 | `forbidden_type` | Link type forbidden at your ACL level. |
| 403 | `forbidden_private` | Global link forbidden with your access. See privacy rules. |
| 400 | `invalid_or_duplicate_link` | Link already exists or snapshot invalid. |
| 409 | `duplicate_link` | Link already exists. |
| 409 | `duplicate_reversed_link` | Reverse link already exists. |
| 400 | `already_trashed_link` | Link already in trash. |
| 400 | `link_in_trash` | Can't edit link in trash. |
| 400 | `not_trashed_link` | Link not in trash. |
| 400 | `target_independent` | Target is independent (`dependent=false`); blocking links allowed only for dependent nodes. |

---

## Access / Grants

| Code | Error | Meaning |
| ---- | ----- | ------- |
| 400 | `grant_snapshot_invalid` | Grant snapshot must include NodeID + GrantedTo. |
| 400 | `scope_id_required` | Scope ID required. |
| 404 | `scope_id_not_found` | Scope node not found. |
| 400 | `scope_user_mismatch` | For STYPE_USER, scope_id must equal user_id. |
| 403 | `no_access_to_scope_branch` | You don’t have access to this branch. |
| 400 | `branch_not_found` | Public branch not found. |
| 400 | `not_embedded` | Public node is not embedded. |
| 400 | `already_embedded` | Public branch is already embedded. |
| 400 | `already_public` | The branch is already public. |
| 400 | `user_not_found` | User not found. |
| 400 | `api_not_allowed` | User does not allowed API usage. |
| 400 | `has_access` | Can't embed branch with active access granted. |
| 400 | `invalid_branch_value` | Field 'branch' must be bool (true/false) or omitted. |
| 400 | `not_public` | This node is not public. |
| 400 | `public_expired` | Publication expired. |
| 400 | `missing_email` | Field 'email' is required. |
| 400 | `already_granted` | User already granted. Use update method to change access. |
| 400 | `invalid_due` | Field 'due' must be a valid ISO8601 datetime string (e.g. 2025-09-13T10:00:00Z). |
| 400 | `invalid_level` | Level must be int between 1 and 3. |
| 400 | `invalid_email` | Invalid email. |
| 400 | `cannot_share_with_self` | You trying to share node with yourself. |
| 400 | `not_shared` | There are no access granted to the user with this node. |

---

## Files / Attachments

| Code | Error | Meaning |
| ---- | ----- | ------- |
| 400 | `file_required` | No file provided. |
| 400 | `file_size_unreadable` | File size unreadable (stream invalid). |
| 400 | `invalid_file_size` | Invalid size (must be >0 and ≤ plan limit). |
| 500 | `attachment_persist_failed` | Failed to persist attachment. |
| 500 | `attachment_delete_failed` | Failed to delete attachment. |

---

## System / Internal (500)

| Code | Error | Meaning |
| ---- | ----- | ------- |
| 500 | `internal.exception` | Unexpected server failure. |

---

:::info
Each error can be namespaced:  
for example `bad_request.invalid_uuid` or `forbidden.auth_missing`.
:::
