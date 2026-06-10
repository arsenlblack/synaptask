---
title: Changelog
slug: /changelog
---

# Changelog

## June 2026 — TypeScript rewrite (staging)

Full backend re-implementation from Python (Flask + Dramatiq + pycrdt) to TypeScript (NestJS + Hocuspocus + Drizzle), with hardened security and complete WebSocket contract.

### Security fixes

* **IDOR (branch endpoint):** `GET /api/branch` / `branch:get` now strictly verifies caller has access to the root node (owner, granted, or public). Previously a UUID could be guessed.
* **WayForPay webhook:** constant-time HMAC compare + amount binding + replay protection.
* **Login throttling:** 10 req/min on `/api/login`, `/api/register`, `/api/google-auth`.

### New WebSocket events

Full contract — see [WebSocket API](/api/ws/connect).

**Reads:** `graph:get`, `branch:get`
**Node mutations:** `node:add`, `node:update`, `node:trash`, `node:restore`, `node:delete`
**Link mutations:** `link:add`, `link:update`, `link:swap`, `link:trash`, `link:restore`, `link:delete`
**History:** `batch:undo`, `batch:redo` (with broadcast of touched diff)
**Sharing:** `node:publish`, `node:unpublish`, `node:access`, `node:access:update`, `node:access:delete`
**Realtime relay (multi-tab):** `presence:update` → `presence:state`, `camera:update` → `camera:presence`, `node:drag`, `node:dragend`
**Settings:** `settings:username` (with validation), `access:visibilityupdate`
**Trash / history pagination:** `trash:page`, `trash:purge`, `history:page`
**AI:** `node:ai_subtasks` (async; emits `node:ai_subtasks_done` / `_error` to user room)
**Heartbeat:** `ws:ping` → `ws:pong`

### New REST endpoints

* **Auth:** `POST /api/google-auth` — Google OAuth (auth-code flow); cookie issued.
* **Upload (S3 presigned-POST):**
  - `POST /api/upload` — issue presigned POST URL (max 5 GB).
  - `POST /api/upload/commit` — finalize after S3 upload, returns presigned GET URL.
  - `GET /api/upload/:id/url` — refresh presigned GET URL (1 h TTL).
  - `DELETE /api/upload/:id` — soft-delete attachment.

### Real-time CRDT (page editor)

* **Hocuspocus server** (apps/realtime) replaces legacy pycrdt sidecar.
* Persistence in Postgres `page_ydocs` table.
* Frontend switched from `y-websocket` to `@hocuspocus/provider` — fixes legacy "blue spinner forever" bug.
* JWT auth via `handshake.token` with per-node ACL (owner/grant ≤ EDITOR can edit; viewers read-only).

### Infrastructure

* **CI/CD modernised:** GitHub Actions → GHCR → autodeploy to staging on push to `staging` branch.
* **Daily DB backups** with optional **offsite S3** push (`S3_BACKUP_BUCKET` env).
* **SES DKIM + SPF** restored after DKIM was accidentally removed from DNS.
* **CloudFlare** Full (strict) + Origin Cert valid through 2041.
