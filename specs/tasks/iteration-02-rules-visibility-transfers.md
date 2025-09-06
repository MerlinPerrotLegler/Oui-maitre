# Itération 02 — Règles objets, visibilité et transferts

- [x] 0015: Étendre `items` pour types `weapon|armor|container` + validations metadata
- [x] 0016: Ajouter champs `visibility` (0..10) et règles côté sérialisation
- [x] 0017: Interdiction lecture inventaires d’autrui (masquer contenu conteneurs)
- [x] 0018: Endpoint `POST /items/{id}/open` (containers): verrouillage/ouverture, erreurs standard
- [x] 0019: Endpoint atomique `POST /transfers` (main↔inventaire↔coffre↔lieu↔don)
- [x] 0020: Règle don (FR‑INV‑2): vérifier main libre receveur, sinon `no_free_hand`
- [x] 0021: Interaction → `visibility=10` (après transfert/prise)
- [x] 0022: Permissions: MJ override, PJ limité à ses items et contexte de lieu
- [x] 0023: Tests unitaires services (transfers, containers, visibility)
- [ ] 0024: Index DB pour holders et visibilité
