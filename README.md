# teatr-frontend

The website for every theatre on `eteatr.uz`. One frontend builds all the sites, and
each theatre's content comes from the API.

> **Merging to `master` deploys to the live sites** once CI passes. Merges go live
> within a few minutes, and a commit that fails to deploy is rolled back.

## What's where

| Folder | What it is |
|---|---|
| `frontend/` | **The theatre frontend. Work here.** Every site is built from it |
| `sites/` | What's different per site: branding, and `kukla`'s own changes |
| `scripts/assemble-site.sh` | Combines `frontend/` and one site's folder |
| `dev/` | Starts a local API with demo data |

| Site | Serves |
|---|---|
| `sites/buxoro` | eteatr.uz, buxoro |
| `sites/yoshtomoshabinlar` | yoshtomoshabinlar, andijon, diydor, qqtyuz, tyuz and any new subdomain |
| `sites/kukla` | kukla |
| `sites/berdax` | berdax |
| `sites/kattakurgan` | kattakurgan |

It uses React 19, Vite and Tailwind v4, served by Express (`server.ts`). Translations
are in `src/locales/`: `uz` (the default), `ru`, `en` and `qr`.

## Run it locally

You need Node 20 and Docker.

**1. Start the API** at http://localhost:8000. The first time, log in to GitHub's
image registry using a GitHub token with the `read:packages` scope:

```bash
docker login ghcr.io
```

```bash
docker compose -f dev/docker-compose.yml up
```

This runs the current API with a made-up `demo` theatre and no real data. The admin
is at http://localhost:8000/admin/, and the login is `admin` / `admin`. Stopping and
starting keeps your edits, and `docker compose -f dev/docker-compose.yml down` resets
to the demo theatre.

When the API changes, get the new version before starting it again:

```bash
docker compose -f dev/docker-compose.yml pull
```

**2. Start the frontend** in a second terminal:

```bash
cd frontend
npm ci
cp .env.example .env
npm run dev
```

**3. Open** http://demo.localhost:3001. The first part of the hostname picks the
theatre, so any theatre you add in the admin works from this one frontend.

Hot reload is off, so refresh the page to see a change.

### See one site's exact build

The steps above use the template's own icons and logo. To see a site as it ships,
with its branding and any code of its own:

```bash
scripts/assemble-site.sh kukla .site-build
```

```bash
cd .site-build && npm ci && cp .env.example .env && npm run dev
```

## Before you change anything

- **Make changes in `frontend/`.** Merged changes go to every site.
- **Site files override the template.** A file in `sites/<site>/` replaces the file
  at the same path, and a site's `public/` replaces the whole template `public/`.
- **`kukla` has its own copy of five files,** so a change to these in the template
  doesn't reach it. Make the change in `sites/kukla/src/` too:
  - `components/home/CountdownTimer.tsx`
  - `components/layout/Navbar.tsx`
  - `components/repertoire/PerformanceCard.tsx`
  - `context/ThemeContext.tsx`
  - `pages/Home.tsx`
- **Ports and container settings aren't here.** They're in the `teatr` repo, because
  they decide how things run on the server.
- **`npm run dev` never touches production unless you ask it to.** Setting
  `VITE_API_URL` to `https://api.eteatr.uz/api` shows real data, but any like or
  comment you submit also goes live.

## Checks

CI checks all five sites on every PR. Run the type check from `frontend/`:

```bash
npm run lint
```

`npm run lint` only type-checks. There are no automated tests, so check changes in
the browser.
