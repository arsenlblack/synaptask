---
title: Authentication
slug: /api/authentication
---

All API and WebSocket interactions require authentication.  
**Tokens** can be generated and managed by the user in their account settings.

---

## API Tokens

- Long-lived credentials generated per user.  
- Each token is tied to a user account and has the same access rights as that user.  
- Tokens can be **revoked** or **rotated** at any time from the user profile.  

> Keep tokens secret. Treat them like passwords.


## Generating a Token

Users can generate API tokens from the **Account Settings → API Tokens** page.  
Each token has:
- **ID** (for management & revocation)  
- **Value** (used in API calls)  
- **Created time**  
- **Last used time**  

Tokens are stored in hashed form server-side (HMAC with server secret).


## Using Tokens

### REST API

Include the API token in the `Authorization` header:

```http
Authorization: Bearer <api_token>
```

Example:

```bash
curl -X GET https://synaptask.space/api/nodes \
  -H "Authorization: Bearer st_xxxxxxxxxxxxxxxxxxxx"
```


### WebSockets

Provide the API token in the connection query string:

```
wss://synaptask.space/socket.io/?token=<api_token>
```

Or send as a header if your client supports it:

```
Sec-WebSocket-Protocol: Bearer, st_xxxxxxxxxxxxxxxxxxxx
```


## Access Levels

Access is enforced per node, based on the `Accesses` table.  
Tokens inherit the access rights of the user who generated them.

| Constant        | Value | Capabilities |
|-----------------|-------|--------------|
| `ACCESS_OWNER`  | 0     | Full control; cannot be revoked |
| `ACCESS_ADMIN`  | 1     | Manage grants; edit/delete nodes & links |
| `ACCESS_EDITOR` | 2     | Edit node content & links; no grant management |
| `ACCESS_VIEWER` | 3     | Read-only |


## Error Responses

All errors return JSON with a machine-readable `error` code:

```json
{
  "error": "unauthorized",
  "message": "Invalid or missing API token"
}
```

Common codes:

| HTTP | Error Code         | Meaning |
|------|--------------------|---------|
| 401  | `unauthorized`     | Missing/invalid API token |
| 403  | `forbidden`        | Token valid but insufficient access level |
| 409  | `version_conflict` | Update attempted with stale `Version` guard |


## Security Notes

- API tokens are **long-lived**, so rotate regularly.  
- Never hardcode tokens in public repos or frontend code.  
- Use HTTPS exclusively.  
- Revoke tokens immediately if they are leaked.  


## Checklist for Integrators

- [ ] Generate API token in Account Settings.  
- [ ] Store it securely (e.g., secrets manager, env variable).  
- [ ] Use `Authorization: Bearer <token>` in every REST call.  
- [ ] Provide `token` in WebSocket connections.  
- [ ] Rotate/revoke tokens periodically.  
