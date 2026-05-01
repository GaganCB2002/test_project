# Architecture Overview

## Frontend

- `src/App.tsx`: session bootstrapping, routing, platform refresh, live feed state
- `src/components/layout/AppShell.tsx`: role-aware workspace shell and navigation
- `src/components/HierarchyExplorer.tsx`: lazy-loaded hierarchy explorer
- `src/pages/*`: module-specific screens
- `src/api/client.ts`: typed API client

## Backend

- `src/server.ts`: Express bootstrap and middleware
- `src/routes/auth.routes.ts`: login and identity endpoints
- `src/routes/hr.routes.ts`: module APIs, mutations, and SSE stream
- `src/services/auth.service.ts`: JWT issuance and verification
- `src/services/hr.service.ts`: business aggregations and dashboard analytics
- `src/data/seed.ts`: seeded enterprise HR dataset
- `src/data/store.ts`: in-memory mutable store

## Security

- JWT authentication
- Role-based module access
- Helmet HTTP hardening
- Audit-style activity stream

## AI features

- Attrition hotspot scoring
- Productivity trend analysis
- Smart recommendations derived from seeded operational metrics

## Extension path

1. Replace `src/data/store.ts` with repository adapters for PostgreSQL or MongoDB.
2. Add job queues for payroll batches, background checks, and notifications.
3. Introduce WebSocket or message-bus events for multi-user live collaboration.
4. Attach document storage, e-sign vendors, calendar APIs, and bank integrations.
