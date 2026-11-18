# Deploying ContactNexus-UI to Vercel

The UI lives on [Vercel](https://vercel.com). No GitHub Actions workflow is needed: Vercel's own GitHub integration handles builds and deploys.

## One-time setup

### 1. Import the repo

- Sign in to Vercel with your GitHub account.
- "Add New..." -> "Project" -> pick `sachin-gupta99/ContactNexus-UI`.
- Framework preset: Vite (auto-detected).
- Build command / output directory: read from `vercel.json` (no override needed).
- Click **Deploy**.

### 2. Point the API rewrites at your Fly app

`vercel.json` ships with `https://contactnexus-service.fly.dev` as the backend. If your Fly app has a different hostname, edit both `destination` URLs and push.

Why the rewrite exists: with the UI on `*.vercel.app` and the API on `*.fly.dev`, the browser treats requests as cross-origin -> CORS preflights on every call, and the refresh cookie has to be `SameSite=None` + `Secure=true`. Routing `/api/*` through Vercel's edge makes the browser see one origin, which is faster and lets the cookie stay `SameSite=Lax`.

### 3. Environment variables

Nothing required. The app uses relative paths (`/api/v1/...`) and relies on the rewrite in dev (Vite proxy) and prod (Vercel rewrite). If you ever add build-time env vars, prefix them with `VITE_` and declare them per environment in the Vercel dashboard.

## What auto-happens

| Trigger | Result |
|---|---|
| Push to `main` | Production deploy to your `*.vercel.app` domain |
| Push to any other branch | Preview deploy on a unique URL |
| Open a PR | Preview URL posted as a bot comment on the PR |
| Merge the PR | Production deploy |

Previews hit your production Fly backend by default. If you want preview branches to hit a staging backend, add an override in Vercel's project settings (Environment Variables -> Preview) or branch on `VERCEL_ENV` inside `vercel.json`.

## Custom domain

Project Settings -> Domains -> Add. Vercel handles DNS + TLS (via Let's Encrypt) automatically if you use Vercel's nameservers; otherwise it gives you a CNAME to add at your registrar.

## Troubleshooting

- **Blank page on reload of `/contacts`** - React Router SPA. Vercel's Vite preset handles this with `/* -> /index.html` by default. If not, add a catch-all rewrite to `vercel.json`.
- **"Failed to fetch" calls hitting the wrong domain** - `vercel.json` rewrite destination is stale; edit and redeploy.
- **CORS error in prod** - should not happen with the rewrite. If it does, requests are leaving Vercel somehow; check the Network tab and confirm the URL is `https://your-ui.vercel.app/api/...` not `https://your-api.fly.dev/api/...`.
