# Itération 03 — Temps réel & Outbox

- [x] 0025: Intégrer Socket.IO (WS) + rooms `world:{id}`, `place:{id}`, `mj:{world}`
- [x] 0026: Implémenter enveloppe événements (`id`, `type`, `world_id`, `at`, `request_id`, `data`)
- [x] 0027: Publier events: `item.transferred`, `character.updated`, `place.updated`
- [x] 0028: Fallback SSE `/events?world_id=...`
- [ ] 0029: Pattern Outbox (table + worker BullMQ) pour diffusion fiable
- [x] 0030: Déduplication client via `id`/`request_id`; exemples côté SDK
- [ ] 0031: Throttling/Backpressure WS (config Socket.IO)
- [ ] 0032: Tests intégration WS (connexion, join rooms, réception events)
