# Choix Techniques — Stack & Architecture (v0.2)

Objectif: une plateforme JDR API-first, mobile-first, réactive (temps réel), accessible et pilotable par IA, avec historique et rollback monde.

## Résumé Exécutif
- Backend: NestJS (TypeScript) + Fastify
- DB: PostgreSQL 15+ (JSONB, FTS), Prisma ORM, Zod pour validation
- Temps réel: WebSocket (Socket.IO) + fallback SSE
- Jobs/Queues: Redis + BullMQ
- Stockage fichiers: S3-compatible (MinIO dev, S3/GCS prod) via URLs présignées
- Frontend: Next.js (App Router) + React + Tailwind CSS + Radix UI/shadcn
- Auth: Auth.js (JWT + OAuth OIDC), Argon2 pour hash
- Permissions: CASL (ABAC), gardes Nest
- Sécurité HTML: sanitize-html (serveur) + DOMPurify (client) + CSP
- Contrats: OpenAPI 3.1 (généré) + schémas Zod partagés; idempotence `Idempotency-Key`
- Observabilité: OpenTelemetry + Sentry; Prometheus/Grafana

## Alignement Exigences
- API-first: endpoints exhaustifs + OpenAPI; SDK TS généré.
- Temps réel & synchro: WS rooms par `world_id`, événements normalisés.
- Mobile-first & accessibilité: Tailwind + Radix UI; tests axe-core.
- IA: champs `ai_schema`, `ai_summary`, `ai_tips`; endpoints `?ai=1`.
- Historique & rollback: event store `history_entries` + projections/snapshots.
- Visibilité/permissions: ABAC (attributs: role, monde, lieu, verrou, vision, ownership).

## Backend
- Framework: NestJS + Fastify (perf, DI, modules, guards, interceptors, pipes)
- Validation: Zod (zod-to-openapi) pour schémas réutilisables API/events
- Serialisation: class-transformer ou mappers dédiés; ETag/If-Match pour PATCH
- Fichiers: upload vers S3 via URL présignée; pas de payloads binaires via API

## Base de Données
- PostgreSQL 15+
- Prisma ORM (migrations, typage)
- JSONB pour `attributes`, `capacities`, `metadata`
- Index: composés par `world_id`, `holder`, `visibility`, temps (`created_at`)
- RLS (optionnel) par `world_id` pour défense en profondeur

## Temps Réel
- Socket.IO serveur Nest (adaptateur Redis pub/sub si plusieurs instances)
- Rooms: `world:{id}`, `place:{id}`, `character:{id}`, `group:{id}`, `mj:{world}`
- SSE: endpoint `/events` pour clients sans WS
- Stratégie: at-least-once, clé `id`/`request_id` pour dédoublonnage client

## Jobs & Outbox
- Redis + BullMQ
- File de travail: `events-outbox`, `ai-metadata`, `sounds`, `snapshots`
- Outbox Pattern: écrire mutation + outbox dans la même transaction; worker diffuse WS

## Stockage & Quotas
- S3/MinIO, bucket par environnement
- Quota: 1 Go par utilisateur (compteur `storage_used_bytes`), gestion côté serveur et job de réconciliation
- Optimisations: thumbnails, limite de taille mimetypes

## Frontend
- Next.js (App Router, RSC) + React 18
- Styling: Tailwind CSS; composants Radix UI/shadcn (A11y)
- État: TanStack Query (cache, offline, déduplication) + Zustand pour locaux
- Mobile-first: layouts responsives, gestures basiques; PWAs (optionnel)

## Auth & Sécurité
- Auth.js: JWT (access+refresh) + OAuth (Google, GitHub)
- Hash: Argon2id
- CSRF: non applicable (SPA + JWT); rotation refresh tokens
- HTML user content: sanitize-html (serveur), DOMPurify (client), CSP stricte

## Permissions
- CASL (rules par monde/acteur: MJ/PJ/PNJ)
- Guards Nest pour routes; décorateurs `@WorldScope()`
- Masquage data: serializers qui respectent `visibility` et accès inventaires

## API & Contrats
- OpenAPI 3.1 généré (decorators Nest + zod-to-openapi)
- Idempotence: `Idempotency-Key` header et `request_id` dans body/events
- Pagination: curseur (`?cursor=`) + `limit`; filtrage cohérent

## Tests & Qualité
- Lint/Format: ESLint + Prettier
- Unitaires: Vitest/Jest (TS), tests pipes/guards/services
- Intégration: Supertest + DB test (containers) + WebSocket tests
- E2E: Playwright (scénarios: transfert, visibilité, freeze, rollback, chat modération)

## Observabilité & Ops
- Traces: OpenTelemetry (Nest + Prisma) → OTLP (Tempo/Jaeger)
- Logs: structuré (pino) + corrélation `request_id`
- Metrics: Prometheus (WS connexions, latence event, jobs)
- Erreurs: Sentry
- Déploiement: Docker; environments dev/staging/prod; Fly.io/Render/Hetzner

## Son & Multimédia
- Diffusion: événement `sound.play` (clients lisent media via URL)
- Files sécurisés: URLs présignées à durée limitée


## Roadmap Technique (proposition)
1) MVP API: worlds, sheets (modèle/copier), characters, items (types), transfers atomiques
2) Règles: visibilité 0–10, dons avec main libre, coffres (open/locked)
3) Temps réel: WS + events; notifications lieu/MJ; outbox
4) Chat: DM/monde/lieu + modération (edit/delete + audit)
5) Historique & rollback: event store + snapshots; endpoint rollback
6) IA: `ai_schema`/`ai_summary`/`ai_tips`, workers
7) Son: endpoint `sounds` + event `sound.play`
8) A11y & Mobile: audits Lighthouse/axe; PWA (optionnel)

## Décisions à figer plus tard
- RLS Postgres activé ou non
- Schéma précis de la whitelist HTML
- Stratégie d’upload (direct-to-S3 vs proxy) et transformations
- Partitionnement `history_entries` (time-based) selon volumétrie

