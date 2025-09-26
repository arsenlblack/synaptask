---
title: GET /api/health
slug: /api/rest/get_health
---

# Healthcheck Endpoint

## Overview

The healthcheck endpoint provides a lightweight liveness probe to verify that the API service is running and responsive. It does not require authentication and is safe to use for infrastructure-level monitoring.

## Endpoint

```
GET /api/health
```

## Authentication

* **None required**

## Rate Limiting

* **120 requests per minute**
* **10,000 requests per hour**

Exceeding these limits will result in a `429 Too Many Requests` response.

## Response

### Success

* **Status Code:** `200 OK`
* **Body:**

```json
{
  "ok": true,
  "status": "up"
}
```

### Error

This endpoint is designed to be extremely reliable. Errors may occur only in cases of severe misconfiguration or internal failures.

* **Status Code:** `500 Internal Server Error`
* **Body:**

```json
{
  "ok": false,
  "error": "internal",
  "message": "Internal server error"
}
```

## Usage Examples

### cURL

```bash
curl -X GET https://synaptask.space/api/health
```

### Python (requests)

```python
import requests

res = requests.get("https://synaptask.space/api/health")
print(res.json())
```

---

**Purpose:** This endpoint is typically used by load balancers, uptime monitoring tools, or container orchestrators (e.g., Kubernetes) to verify that the service is healthy and should remain in rotation.
