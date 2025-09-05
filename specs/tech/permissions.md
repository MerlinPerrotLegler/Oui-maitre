# Spécifications Techniques — Permissions & Sécurité (v0.2)

## Auth
- Email/Mot de passe (JWT access + refresh). BCrypt/Argon2 pour `password_hash`.
- OAuth (OIDC): Google/GitHub (exemples) → fédération vers un compte user unique.
- Tokens d'invitation signés, durée configurable.

## Scopes API (IA)
- `world:read`, `world:write`
- `character:read`, `character:write`
- `item:read`, `item:write`
- `chat:read`, `chat:write`, `chat:moderate`
- `npc:control`
Les clés API portent des scopes et un `world_id` restreint.

## Matrice (résumé)
- MJ: full access (monde qu'il possède).
- PJ: lecture monde; écriture limitée à sa fiche/ses items; pas d'accès aux inventaires d'autrui; mouvements conditionnés par lieu/verrou.
- PNJ: agi via MJ/IA selon scopes.

## Règles spécifiques
- Visibilité: item rendu si `item.visibility > sheet.vision` ou possession personnelle.
- Inventaires d'autrui: endpoints masquent `items[]` des conteneurs appartenant aux autres personnages, sauf autorisation MJ (override temporaire ou règle monde).
- Don direct: nécessite co-présence + main libre du receveur.
- Freeze/Lock: toute mutation refusée avec erreur `world_locked` (sauf exemptions MJ/chat/lecture).
- HTML en lieux: sanitation stricte (whitelist de balises/attributs) et CSP.

## Erreurs standardisées
{
  "error": "world_locked | forbidden | not_found | validation_error | no_free_hand | container_closed",
  "message": "...",
  "details?": { ... }
}

## Idempotence
- En-tête `Idempotency-Key` ou `request_id` dans le body. Répétitions retournent le même résultat (statut 200/201) sans duplication d'événements ni d'historique.

## Audit
- Toute mutation crée une `history_entry` (avant/après). Éditions/suppressions chat = soft, avec audit.

