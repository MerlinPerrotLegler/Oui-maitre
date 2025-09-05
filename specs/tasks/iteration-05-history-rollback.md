# Itération 05 — Historique & Rollback

- [ ] 0040: Écrire `history_entries` pour toutes mutations (before/after, actor, source, request_id)
- [ ] 0041: Endpoint `GET /worlds/{id}/history` (filtres entité/période/acteur)
- [ ] 0042: Snapshots (vue matérialisée/worker) pour états monde
- [ ] 0043: Endpoint `POST /worlds/{id}/rollback { at }` (restauration + audit)
- [ ] 0044: Event `world.rolled_back` + resynchronisation côté clients
- [ ] 0045: Tests de cohérence après rollback (items/lieux/mains/tenue)
