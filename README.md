# My Legal AI Buddy

My Legal AI Buddy is a local-first document assistant for summarizing
contracts, extracting important terms, and highlighting clauses that may
deserve professional review.

> **Not legal advice.** This MVP does not replace a qualified lawyer. Findings
> are heuristic, may be incomplete, and must be checked against the original
> document.

## Features

- Paste or upload plain-text contract content
- Save documents and version history in SQLite through Prisma
- Generate section summaries and source-linked review findings
- Detect dates, parties, obligations, renewal, termination, liability,
  indemnity, privacy, intellectual-property, and jurisdiction language
- Delete documents and their versions
- Account signup, login, logout, and owner-scoped documents
- No external AI provider or document upload is required

## Setup

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

Create an account at `/login` before saving documents. Passwords are hashed
with bcrypt and sessions use random, HttpOnly cookies.

Open `http://localhost:3000`.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

## Data and privacy

The default database is `prisma/dev.db`, stored locally and ignored by Git.
This MVP performs deterministic local analysis and does not send document
contents to a model provider. Authentication and owner-scoped authorization
are included, but encrypted storage, retention controls, CSRF protection, and
a security review are still required before public deployment. Baseline browser
security headers are configured in `next.config.ts`.
