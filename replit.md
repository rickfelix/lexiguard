# LexiGuard

AI contract analyzer for freelance developers. Upload or paste a plain-text contract and get back IP/payment/scope risks plus a plain-English translation of the legalese.

## Stack

- **Frontend:** Vite 8 + React 18 + TypeScript + Tailwind CSS + React Router v7
- **Backend:** Express 5 (TypeScript) running in Vite middleware mode in dev, served as compiled JS in prod
- **DB:** Replit Postgres via Drizzle ORM (`postgres` driver). Tables: `users`, `documents`, `analysis_results`. UUID primary keys (`varchar` + `gen_random_uuid()`).
- **AI:** OpenAI integration (`gpt-4o-mini`, JSON mode, strict schema). Env vars `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`.
- **Auth:** Anonymous only — `lg_uid` cookie issued on first request, scopes documents to that user.

## Workflow

`Start application` runs `npm run dev` → `tsx watch server/index.ts`. The Express server boots Vite in middleware mode and serves both API (`/api/*`) and the SPA on port 5000 (host `0.0.0.0`, `allowedHosts: true`). Restart it whenever `package.json` scripts or anything in `server/` changes.

## Folder Layout

- `server/` — Express app
  - `index.ts` — entry; mounts middleware, API routes, Vite/static
  - `db.ts`, `schema.ts` — Drizzle DB client + schema
  - `middleware/anonymousUser.ts` — issues/reads `lg_uid` cookie, ensures user row
  - `routes/documents.ts` — `POST /api/documents`, `GET /api/documents/:id`, `GET /api/documents/:id/analysis`
  - `services/ai.ts` — calls OpenAI, validates the JSON, persists `analysis_results`, marks documents `ready`/`failed`
- `src/` — React SPA
  - `pages/` — `Home.tsx` (landing), `Upload.tsx` (file/paste), `Document.tsx` (polls every 2 s, renders results)
  - `components/` — `Layout.tsx`, `Header.tsx`, `Footer.tsx`
  - `lib/api.ts` — typed fetch client (always sends cookies)
- `docs/` — original product spec, designs, brand
- `dist/` — production build output (`dist/client/` static assets, `dist/server/index.js` server bundle)

## Scripts

- `npm run dev` — dev server (Express + Vite middleware)
- `npm run build` — `vite build` then `esbuild server/index.ts` into `dist/server/index.js`
- `npm start` — runs the prod bundle (`NODE_ENV=production node dist/server/index.js`)
- `npm run db:push` — sync Drizzle schema (use `--force` only when needed)

## Deployment

Configured for **autoscale**: `build = npm run build`, `run = npm start`. The user must click Publish from the main project after this task is merged.

## Data Model

- `users(id, cookie_id unique, created_at)` — one row per anonymous visitor
- `documents(id, user_id, title, source: 'file'|'paste', content, char_count, status: 'pending'|'processing'|'ready'|'failed', error_message, created_at, updated_at)`
- `analysis_results(id, document_id unique, summary, risks jsonb, translations jsonb, model, created_at)`

`risks[]` items: `{title, category: IP|Payment|Scope|Termination|Liability|Confidentiality|Acceptance|Other, severity: low|medium|high, explanation, clauseExcerpt}`.
`translations[]` items: `{original, clauseTitle, plainLanguage}`.

## API

All endpoints require the `lg_uid` cookie (set automatically). All document responses are scoped to the requesting cookie's user.

- `POST /api/documents` — multipart form with either `file` (txt/md, ≤1 MB) or `text` field, plus optional `title`. Creates the document, kicks off analysis async, returns `{id, status:'pending'}`.
- `GET /api/documents/:id` — document metadata + status.
- `GET /api/documents/:id/analysis` — `{status, document, analysis}`. `status` is `processing` until the AI call resolves, then `ready` (with `analysis`) or `failed` (with `errorMessage`).

## Coding Standards

- TypeScript strict
- API errors fail loudly (no silent fallbacks)
- Cookies: `httpOnly`, `sameSite: 'lax'`, `secure` in prod
- Mobile-first responsive Tailwind, brand tokens from `src/styles/globals.css`

## MVP Scope (this sprint)

In: landing page (exact marketing copy from `docs/spec.md`), plain-text contract upload, OpenAI risk analysis, results dashboard, anonymous cookie, autoscale deploy config.

Out: real auth, PDF/DOCX parsing, background queue, email/Stripe, multi-page marketing site, contract editing/sharing.
