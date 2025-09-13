---
title: Quickstart
slug: /getting-started/quickstart
---

This guide walks you through the fastest way to get started with SynapTask.

## Prerequisites
- Node.js & npm
- Access to SynapTask API (account & API key)

## Steps
1. **Register/Login** at the web app.
2. **Subscribe on Plus or higher plan** (API access is available starting from Plus plan).
3. **Obtain credentials** (API token).
4. **Connect via WebSocket**:
   ```js
   import io from 'socket.io-client';
   const socket = io('https://synaptask.space', { withCredentials: true });
   socket.on('connected', console.log);
   ```
5. **Fetch your graph**: either through REST `GET /api/graph` or socket `graph:get`.

That's it — you can now explore nodes, links, and start building in 3D.
Next, learn how to [create your first node](../guides/create-node)
