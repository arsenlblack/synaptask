---
title: Account
slug: /concepts/account
---

An **Account** represents a registered user and their entitlements.

## Model

- **username**: public handle, unique across the system.
- **email**: unique identifier for login and notifications.
- **plan**: subscription plan (e.g., free, pro).
- **subscriptionState**: current billing status (active, past_due, canceled).
- **annuallyPayment**: whether the plan is billed annually.
- **cardPan**: masked payment card (partly masked).
- **cameraPosition**: user-specific graph viewport settings.
- **showAllCards**: boolean preference for card visibility.
- **grantedBy**: list of node ids and users I have shared nodes with.
  >`[ { nodeId: uuid, userName: str, userEmail: str, level: int, branch: true }, {...}, ... ]`
- **grantedTo**: list of nodeids and users who shared nodes with me.
  >`[ { nodeId: uuid, userName: str, userEmail: str, level: int, branch: true }, {...}, ... ]`

  - **nodeId**: the id if root node being granted.
  - **level**: 
  - **branch**: if true, the grant applies to the entire downstream branch.
    - _~~0 = owner~~_
    - 1 = admin: can edit, share and delete
    - 2 = editor: can edit
    - 3 = viewer: read only

## Rules

- Multiple grants may overlap; the **highest privilege wins** (lowest numeric Level).
- Access can be revoked or hide.
- Free plan: limited to **3 active income accesses**.
- Plus plan or more: **unlimited income accesses**, no outcome.
- Pro plan: **unlimited income and outcome accesses**.

## Related

- [Nodes](./nodes.md) for audit trail of account and access changes.
