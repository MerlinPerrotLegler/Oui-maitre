# Itération 01 — MVP API de base

- [x] 0001: Initialiser repo monorepo (server+web), config TypeScript, ESLint/Prettier
- [ ] 0002: Scaffold NestJS (Fastify), modules: auth, worlds, sheets, characters, items
- [ ] 0003: Intégrer Prisma (PostgreSQL), config .env et migrations initiales
- [ ] 0004: Implé schéma DB minimal (users, worlds, invitations, places, groups, group_members)
- [ ] 0005: Implé schéma DB (sheets, characters, items) selon `specs/tech/data-model.md`
- [ ] 0006: Auth email/mot de passe (JWT access+refresh), Argon2id
- [ ] 0007: OAuth OIDC (Google/GitHub) via Auth.js/Nest adapter
- [ ] 0008: Endpoints CRUD de base: worlds, places, groups, group_members
- [ ] 0009: Endpoints sheets (création, lecture, duplication `is_template`), characters (CRUD minimal)
- [ ] 0010: Endpoints items (CRUD minimal, types acceptés, sans logique spécifique)
- [ ] 0011: Invitations: créer, lister, accepter via token
- [ ] 0012: OpenAPI 3.1 (génération) + route `/docs`
- [ ] 0013: Seed script (1 monde, 1 MJ, 2 PJ, lieux de test)
- [ ] 0014: CI basique (build, lint, test) GitHub Actions
