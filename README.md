# relatos-blog-admin

React (Vite) admin SPA for [Relatos Reales](../relatos-blog) — login, create/edit posts (rich
text via TipTap, cover image, category, tags), publish/unpublish. Talks to
[relatos-blog-api](../relatos-blog-api) over REST with a JWT bearer token.

## Local development

```bash
npm install
npm run dev   # http://localhost:5173, needs relatos-blog-api running (default http://localhost:8080/api)
```

Copy `.env.example` to `.env` to point at a different API URL (`VITE_API_BASE_URL`).

Seeded login (from `relatos-blog-api`'s `DataInitializer`): `admin@relatosreales.com` / `changeme123`.

## What's here vs. deferred

Implemented: login, Posts list (search, status filter, status toggle, delete), post editor
(title/slug/cover image URL or upload/category/free-text tags/rich-text description — only
title, image, and description are required, matching the target UI). Category dropdown reads
from the API; there's no dedicated Categories/Series/Tags/Reports management screen yet — the
sidebar shows those as "coming soon" placeholders until a later phase.

## Deploying (Cloudflare Pages)

1. Push this repo to GitHub/GitLab.
2. In Cloudflare Pages: **Create a project** → connect the repo.
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `VITE_API_BASE_URL` = the deployed `relatos-blog-api` URL, e.g.
     `https://relatos-blog-api.onrender.com/api`
3. After the first deploy, copy the `*.pages.dev` URL and set it as `CORS_ALLOWED_ORIGINS` on the
   `relatos-blog-api` Render service (see that project's README) so the browser is allowed to
   call the API.
