# Deployment Guide — client1 (Vite + React)

## Overview
This document describes how to deploy the `client1` frontend to Vercel and how to wire it to a production backend.

## Prerequisites
- Vercel account
- Git repository containing the workspace (recommended)
- Node.js + npm installed locally (for local build/tests)
- Optional: Vercel CLI (`npm i -g vercel`)

## Files changed/added
- Root Vercel config: [client1/vercel.json](client1/vercel.json) — SPA rewrite to `index.html`.

## Environment variables
Do NOT rely on the local `.env` for production. Add the following ENV in the Vercel Project Settings (or via CLI):
- `VITE_API_URL` — set to your production API base (e.g. `https://api.example.com/api`).

Note: Vite exposes only variables prefixed with `VITE_` to the client.

## Build settings for Vercel
- Framework Preset: (choose `Other` or `Vite` if available)
- Root Directory: set to the project root for this repo or `client1` if monorepo
- Build Command: `npm run build`
- Output Directory: `dist`

## Deploy via Vercel Dashboard
1. Create/import a new project and point it to your Git repo.
2. During setup, set the Root Directory to `client1` (if repo root contains server/ and client1/).
3. Configure Build Command and Output Directory as above.
4. In Environment Variables, add `VITE_API_URL` with your production API URL.
5. Deploy — Vercel will run `npm run build` and publish `dist`.

## Deploy via Vercel CLI
```bash
npm i -g vercel
cd client1
vercel login
vercel # follow prompts to link/create project
# add environment variable for production
vercel env add VITE_API_URL production
# then deploy to production
vercel --prod
```

## Local test of production build
```bash
cd client1
npm ci
npm run build
npm run preview   # uses `vite preview` to serve the `dist` locally
# or use a static server
npx serve dist
```

## Backend (server/) — recommendation
- Deploy the backend as a separate service (Render, Railway, Heroku, or Vercel serverless functions).
- After backend deploy, set `VITE_API_URL` to the backend's base URL (include `/api` if your client expects it).
- Ensure CORS is configured to allow the frontend origin.

If you prefer to host the backend on Vercel, convert API endpoints to Vercel Serverless Functions (place them under `/api` top-level folder), or deploy the server as a separate Node project and set the frontend `VITE_API_URL` accordingly.

## Common issues & fixes
- 404 on refresh: solved by the SPA rewrite in [client1/vercel.json](client1/vercel.json).
- `import.meta.env.VITE_*` not set: check Vercel Env variables are set for the correct environment (Preview/Production).
- CORS / auth errors: confirm backend allows requests from the deployed frontend origin and that tokens are handled correctly.

## Next steps you might want me to do
- Add production API URL to `client1/.env` (commented) or set it in Vercel for you.
- Help deploy the backend and set `VITE_API_URL` automatically.

---
Created by assistant to prepare Vercel deployment for the `client1` project.
