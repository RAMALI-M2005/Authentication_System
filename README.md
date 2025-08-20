# Auth System

Lightweight authentication example built with Next.js. Implements email/password registration and login, session tokens, password hashing, basic account management routes and a small UI built with shadcn/Tailwind components.

## Features
- Email / password sign-up and sign-in
- Session tokens (access/refresh or session cookie)
- Password hashing (crypto)
- Sign out / session revoke
- OAuth (Google) sign-in endpoint
- Edge-friendly middleware that protects routes via an API/session check
- Minimal UI components scaffolded with shadcn

## Tech
- Next.js (app router)
- React (client + server components)
- Tailwind CSS + shadcn UI
- Node crypto for password hashing
- Optional JWT verification for edge middleware (jose)

## Project layout (important files)
- src/app — Next.js app routes & pages
  - account/sign-in/page.tsx — sign-in client page
  - account/sign-up/page.tsx — sign-up page
  - dashboard/ — protected area
  - layout.tsx — root layout (Toaster, globals)
- src/components — UI pieces
  - auth/auth-buttons.tsx — avatar + drawer + signout UI
  - auth/google-button.tsx — OAuth button
  - auth/signout-button.tsx — sign out action
  - ui/* — shadcn-style UI components (Button, Card, Input, Label, Sonner wrapper)
- src/api — API routes
  - api/auth/session/route.ts — validate session by id
  - api/auth/signout/route.ts — sign out route
  - api/oauth/google/route.ts — google oauth callback
  - api/auth/oAuthSignIn/route.ts — oauth sign-in helper
- src/lib — helpers and server logic
  - auth.ts, actions.ts, helpers.ts, server.ts, dbConnect.ts
  - utils.ts — small UI helper (cn)
  - oauth/base.ts — oauth helpers
- src/models/user.model.ts — user model / DB logic
- src/middleware.ts — route protection (calls api/auth/session to avoid importing DB in edge)

## Environment
Create a `.env` file from `.env.example` and set required vars (examples):
```
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/authdb
JWT_SECRET=your_jwt_secret_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
SESSION_COOKIE_NAME=sessionId
```

Adjust names/values to your deployment.

## Install & run (Windows)
From project root:
```powershell
npm install
# If using shadcn UI and Tailwind not installed:
npx shadcn-ui@latest init
npm install lucide-react class-variance-authority tailwind-merge
# Start dev
npm run dev
```

## Scripts
- npm run dev — start Next.js in development
- npm run build — build for production
- npm start — start production server (after build)
- npm test — run tests (if provided)

## Notes & gotchas
- Middleware runs in the Edge runtime — do NOT import server-only modules (models/DB). This causes errors like `Cannot read properties of undefined (reading 'User')`. The project avoids this by calling an internal API route (`/api/auth/session`) from middleware to validate a session id cookie.
- Alternatively, use an edge-compatible JWT check in middleware (package: `jose`) and keep DB lookups in server routes/components.
- Client components that use hooks must include `"use client"` at the top (example: sign-in page, auth-buttons).
- Password hashing uses Node crypto; server-only logic should run in API routes / server components.

## API (summary)
- POST /api/auth/register — create user
- POST /api/auth/login — sign in, returns session/token
- POST /api/auth/session — validate sessionId (used by middleware)
- POST /api/auth/signout — revoke session
- GET/POST /api/oauth/google — OAuth helper/callbacks

Check `src/api` for exact request/response shapes.

## Security
- Use strong, unique secrets; rotate periodically
- Store refresh tokens in httpOnly cookies
- Enforce HTTPS in production
- Rate-limit auth endpoints

## Contributing
- Run linters/tests before PRs
- Keep auth and DB code server-only; keep middleware edge-compatible

## License
Add a LICENSE file (e.g. MIT) for