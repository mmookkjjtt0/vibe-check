# VibeCheck Me

Single-page web app for collecting "vibe check" responses about a person from friends, family, and partners. Respondents enter their name + email, pick a relationship type, and answer a multi-language questionnaire. Only the owner can view results.

## Stack

- **Frontend:** single-file ES module in [index.html](index.html) (HTML + CSS + JS)
- **Backend:** Supabase (Postgres + RLS + Auth for the owner only)
- **Local server:** `npx serve` or [serve.mjs](serve.mjs)

## Run locally

```bash
npx serve . -p 3000
# or
node serve.mjs
```

Then open http://localhost:3000.

## Database

The Supabase schema and RLS policies are documented at the top of [index.html](index.html) — run that SQL in the Supabase SQL editor before first use.

## Architecture notes

Respondents do **not** authenticate. They submit name + email which are stored directly on the response row. The owner (`mmookkjjtt0@gmail.com`) is the only authenticated user; the owner-only read policy gates `/results`.
