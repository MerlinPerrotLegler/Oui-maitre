# Spécifications Techniques — API (v0.2)

Style: REST JSON, API-first, idempotence via `request_id` (header ou body). Auth: JWT (email/mot de passe) + OAuth (OIDC) avec refresh tokens.

Base URL: `/api/v1`

## Auth
- POST `/auth/register` { email, password, display_name }
- POST `/auth/login` { email, password } → { access_token, refresh_token }
- POST `/auth/refresh` { refresh_token }
- POST `/auth/logout`
- OAuth: `/oauth/{provider}/start`, `/oauth/{provider}/callback`

## Worlds
- POST `/worlds` { name } → { world }
- GET `/worlds/{world_id}`
- PATCH `/worlds/{world_id}` { name? }
- POST `/worlds/{world_id}/advance-date` { by: int|date_increment }
- POST `/worlds/{world_id}/lock` { scope?: { places[], groups[], characters[] } }
- POST `/worlds/{world_id}/unlock`
- POST `/worlds/{world_id}/rollback` { at: timestamp, reason? } → émet `world.rolled_back`
- POST `/worlds/{world_id}/sounds` { url, volume?:0..1, targets?: { character_ids?:[], place_id?, group_id?, broadcast?:bool } }

## Invitations
- POST `/worlds/{world_id}/invitations` { expires_at? }
- GET `/worlds/{world_id}/invitations`
- POST `/invitations/{token}/accept`
- POST `/invitations/{id}/revoke`

## Places
- POST `/worlds/{world_id}/places` { name, attributes?, avatar_url? }
- GET `/worlds/{world_id}/places`
- GET `/places/{place_id}`
- PATCH `/places/{place_id}` { name?, attributes?, avatar_url? }

## Groups
- POST `/worlds/{world_id}/groups` { name }
- GET `/worlds/{world_id}/groups`
- GET `/groups/{group_id}`
- POST `/groups/{group_id}/members` { character_id }
- DELETE `/groups/{group_id}/members/{character_id}`

## Sheets (inclut fiches modèle)
- POST `/worlds/{world_id}/sheets` { is_template, name, attributes?, capacities?, vision?, purse_*?, avatar_url? }
- GET `/worlds/{world_id}/sheets?is_template=true|false`
- GET `/sheets/{sheet_id}`
- PATCH `/sheets/{sheet_id}` { fields… } — MJ peut modifier toute fiche; PJ: seulement la sienne
- POST `/sheets/{sheet_id}/duplicate` → crée une nouvelle fiche (copie) avec `template_source_id=sheet_id`

## Characters
- POST `/worlds/{world_id}/characters` { sheet_id, type: PC|NPC, user_id? (si PC), current_place_id }
- GET `/worlds/{world_id}/characters`
- GET `/characters/{character_id}`
- PATCH `/characters/{character_id}` { current_place_id?, right_hand_item_id?, left_hand_item_id? }

## Items
- POST `/worlds/{world_id}/items` { name, type, description?, metadata?, capacities?, visibility?, avatar_url? }
- GET `/worlds/{world_id}/items?holder=place:{id}|character:{id}|item:{id}|world`
- GET `/items/{item_id}` — si type=container et non ouvert: contenu masqué selon permissions
- PATCH `/items/{item_id}` { name?, description?, metadata?, capacities?, visibility?, avatar_url? }
- POST `/items/{item_id}/open` { force?:bool } — ouvre un conteneur; peut déclencher `world.freeze`

## Transferts (atomiques)
- POST `/transfers`
  Body:
  {
    "item_id": "uuid",
    "from": { "type": "place|item|character_hand|character_outfit|world", "id": "uuid", "hand?": "left|right" },
    "to":   { "type": "place|item|character_hand|character_outfit|world", "id": "uuid", "hand?": "left|right" },
    "request_id?": "idempotency-key"
  }
  Règles:
  - Vérifie verrous monde.
  - Vérifie main libre pour `to.type=character_hand` (don direct FR-INV-2).
  - Applique règles de visibilité (interaction → visibility=10).
  - Historise avant/après; émet `item.transferred`.

## Chat
- POST `/worlds/{world_id}/chats` { kind: dm|world|place, place_id?, participants:[character_id…] }
- GET `/worlds/{world_id}/chats`
- GET `/chats/{chat_id}`
- POST `/chats/{chat_id}/messages` { content }
- PATCH `/chats/{chat_id}/messages/{message_id}` { content } — modération/auteur
- DELETE `/chats/{chat_id}/messages/{message_id}` — soft delete

## Timeline / History
- GET `/worlds/{world_id}/history?entity_type?&entity_id?&from?&to?`
- GET `/history/{entry_id}`

## Temps réel
- WebSocket: `/ws?world_id=...` — souscription multi-événements
- SSE: `/events?world_id=...`
- Webhooks (optionnel): `/worlds/{world_id}/webhooks`

## Règles de permissions (résumé API)
- MJ: accès complet sur resources du monde.
- PJ: accès lecture/écriture limité à sa fiche et ses items; visibilité d’items par règle (visibility > vision). Inventaires d’autrui inaccessibles.
- IA: scopes spécifiques (lecture, écriture, npc_control); limitation par monde.

## Exemples de payloads

World.updated (GET /worlds/{id})
{
  "id": "w_123", "name": "Aethria", "current_date": "2025-09-05",
  "lock_state": "none", "owner_user_id": "u_1"
}

Item (weapon)
{
  "id": "it_1", "world_id": "w_123", "name": "Épée courte",
  "type": "weapon",
  "metadata": { "degats_base": 2, "degats_des": "1d6" },
  "capacities": [ { "name": "Perforant", "details": "...", "voix": "combat" } ],
  "visibility": 5,
  "holder": { "type": "character_hand", "character_id": "c_1", "hand": "right" }
}

Erreur don sans main libre
{
  "error": "no_free_hand",
  "message": "Le receveur n'a pas de main libre.",
  "details": { "character_id": "c_2" }
}

