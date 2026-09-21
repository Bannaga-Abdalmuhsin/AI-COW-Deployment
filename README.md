# Movement Predictive & Analysis Tool

An STC-branded decision-support experience for learning from historical Cell on Wheels (COW) movements. The public deployment presents operational search, aggregate insights, model validation results, and an Excel-grounded assistant.

## Live demonstration

The GitHub Pages site is a presentation environment. It uses a client-side session gate for the demonstration; it is **not** a substitute for production authentication.

- Username: `stc.demo`
- Password: `COW@2026`

Before connecting sensitive or live STC data, replace the demonstration gate with server-side authentication and authorization through an approved identity provider and private API.

## Product areas

- **Executive overview** — program scope, value proposition, and operating metrics
- **Movement intelligence** — aggregate movement trends, regions, categories, and vendor footprint
- **Predictive models** — validation results for next-region, movement-category, and timing models
- **AI operations agent** — grounded natural-language retrieval across the complete uploaded movement workbook
- **Data governance** — privacy controls and the target production architecture

## Public-data policy

This public demonstration includes the complete Excel-derived movement knowledge index in `public/operations-knowledge.json`, including operational record fields. It also includes sanitized aggregates and five upcoming model expectations. Do not use this deployment for confidential data.

Historical source records should remain in an approved private data store. Model training should run in a controlled environment, with only reviewed aggregate metrics promoted to this demonstration.

## Local development

```bash
pnpm install
pnpm dev
```

Quality checks:

```bash
pnpm typecheck
pnpm test
pnpm build
```

## Technology

- React 18 and TypeScript
- Vite
- React Router
- Recharts
- Tailwind CSS and Radix UI
- GitHub Pages deployment

## Production hardening

Before operational use:

1. Integrate STC-approved SSO and role-based access control.
2. Move data and inference behind a private authenticated API.
3. Store secrets outside the browser and repository.
4. Add audit logging, retention policies, and security monitoring.
5. Revalidate models with time-based holdouts and operational acceptance thresholds.
