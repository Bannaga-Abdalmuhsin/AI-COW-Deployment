# Movement Predictive & Analysis Tool

An STC-branded decision-support experience for learning from historical Cell on Wheels (COW) movements. The public deployment presents sanitized aggregate insights, model validation results, and a proposed data-governance architecture without publishing operational records.

## Live demonstration

The GitHub Pages site is a presentation environment. It uses a client-side session gate for the demonstration; it is **not** a substitute for production authentication.

- Username: `stc.demo`
- Password: `COW@2026`

Before connecting sensitive or live STC data, replace the demonstration gate with server-side authentication and authorization through an approved identity provider and private API.

## Product areas

- **Executive overview** — program scope, value proposition, and operating metrics
- **Movement intelligence** — aggregate movement trends, regions, categories, and vendor footprint
- **Predictive models** — validation results for next-region, movement-category, and timing models
- **Data governance** — privacy controls and the target production architecture

## Public-data policy

This repository deliberately excludes raw history, COW identifiers, coordinates, routes, and record-level forecasts. The deployed dashboard reads only `public/movement-insights.json`, a sanitized aggregate artifact.

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
