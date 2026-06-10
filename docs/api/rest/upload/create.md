---
title: POST /api/upload
slug: /api/rest/upload/create
---

Initiate a file upload to attach to a node. Returns a **presigned POST** URL for direct upload to S3.

## Flow

1. Client → `POST /api/upload` with `{ nodeId, filename, size, mime }` → server returns `{ attachmentId, uploadUrl, fields }`.
2. Client uploads file **directly to S3** via `POST <uploadUrl>` (multipart/form-data) with `fields` + `file`. S3 returns `204`.
3. Client → `POST /api/upload/commit` with `{ attachmentId }` → server verifies object in S3 and returns presigned GET URL.

## Behavior

* ACL: only **owner of the node** can attach files (broader sharing planned).
* Size cap: **5 GB** per file.
* Storage backend: AWS S3 with `acl: private`.
* Presigned upload URL valid for **10 minutes**.

## Endpoint

**Endpoint:** `POST /api/upload`
**Auth:** cookie session (`st_access` httpOnly cookie set by `/api/login`).
**Rate limit:** 60 requests / minute / user.

### Request body

```json
{
  "nodeId": "<uuid>",
  "filename": "report.pdf",
  "size": 245678,
  "mime": "application/pdf"
}
```

### Success (200)

```json
{
  "attachmentId": "<uuid>",
  "uploadUrl": "https://<bucket>.s3.<region>.amazonaws.com/",
  "fields": {
    "key": "uploads/<random>/report.pdf",
    "acl": "private",
    "Policy": "...",
    "X-Amz-Signature": "..."
  },
  "expireIn": 600,
  "maxSizeBytes": 5368709120
}
```

### Errors

* `404 missing_filename` / `invalid_file_size` / `node_not_found`
* `403 no_permission` (not owner) / `file_too_large` (> 5GB)
* `503 upload_not_configured` (S3 env vars missing on server)

## Example (browser, with cookies)

```js
const res = await fetch('/api/upload', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nodeId, filename: file.name, size: file.size, mime: file.type }),
});
const { attachmentId, uploadUrl, fields } = await res.json();

const form = new FormData();
Object.entries(fields).forEach(([k, v]) => form.append(k, v));
form.append('file', file);
const s3 = await fetch(uploadUrl, { method: 'POST', body: form });
if (s3.status !== 204) throw new Error('S3 upload failed');

const commit = await fetch('/api/upload/commit', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ attachmentId }),
}).then(r => r.json());
// commit.attachment.presignedUrl — URL для перегляду/скачування (1h TTL)
```
