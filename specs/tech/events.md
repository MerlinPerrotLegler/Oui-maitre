# Spécifications Techniques — Événements Temps Réel (v0.2)

Transport: WebSocket (recommandé) ou SSE. Tous les événements partagent un en-tête commun.

## Enveloppe commune
{
  "id": "evt_...",           // uuid
  "type": "world.updated",    // type d'événement
  "world_id": "w_123",
  "at": "2025-09-05T12:34:56Z",
  "request_id": "req_...",    // idempotence, peut être null
  "data": { ... }              // payload spécifique
}

## Événements

### world.updated
data: { id, name?, current_date?, lock_state? }

### world.rolled_back
data: { id, target_at, by_user_id, summary }

### world.freeze / world.unfreeze
data: { scope?: { places[], groups[], characters[] }, reason? }

### place.updated
data: { id, name?, attributes?, avatar_url? }

### character.updated
data: { id, sheet_id?, current_place_id?, hands?, outfit? }

### group.updated
data: { id, members_added?: [character_ids], members_removed?: [character_ids] }

### item.transferred
data: {
  item_id,
  from: { type, id, hand? },
  to:   { type, id, hand? },
  visibility_after,
  by_character_id?
}

### container.opened
data: { item_id, by_character_id, is_locked_before, is_open_after }

### chat.message.created | chat.message.updated | chat.message.deleted
data: { chat_id, message: { id, from_character_id, to?, content?, edited, deleted, at } }

### history.entry.created
data: { id, entity_type, entity_id, action, at, actor_user_id }

### notification.broadcast
data: { scope: { place_id? }, message, actors?: [character_ids] }

### sound.play
data: { url, volume, targets?: { character_ids?:[], place_id?, group_id?, broadcast?:bool }, by_user_id }

## Abonnements
- Par défaut, un client connecté à `/ws?world_id=W` reçoit tous les événements du monde W autorisés par ses permissions.
- Des filtres additionnels peuvent être passés à l'abonnement (ex: `types=chat.*;item.*`).

## Garanties
- Ordre relatif par `world_id`: monotone (même partition), horodatage croissant.
- Au moins une fois; utiliser `id` et `request_id` pour dédupliquer.
- Backfill possible via `/worlds/{id}/history` en cas de perte.

