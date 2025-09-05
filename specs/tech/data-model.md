# Spécifications Techniques — Modèle de Données (v0.2)

Ce document décrit le schéma logique et les contraintes clés. Implémentable en SQL relationnel (PostgreSQL recommandé) ou document store, en conservant les mêmes invariants.

## Principes
- API-first, évènementiel (events), historique immuable avec rollback monde.
- Concurrence optimiste via `version`/`etag` sur entités mutables.
- Références polymorphes limitées et normalisées (`holder_ref`).

## Entités principales

### users
- id (uuid, pk)
- email (unique), password_hash (nullable si OAuth-only)
- oauth_provider, oauth_sub (nullable)
- display_name
- avatar_url
- storage_used_bytes (quota 1 Go/user)
- created_at, updated_at

### worlds
- id (uuid, pk)
- name
- owner_user_id (fk users)
- current_date (date or bigint ticks)
- lock_state (enum: none, global, partial)
- locked_scope (jsonb, nullable) — ex: { places: [id...], groups: [id...], characters: [id...] }
- created_at, updated_at, version

### invitations
- id (uuid, pk)
- world_id (fk worlds)
- token (unique, indexed, opaque)
- status (enum: active, used, revoked, expired)
- expires_at (timestamptz, nullable)
- created_by (fk users)
- created_at, used_at, revoked_at

### places
- id (uuid, pk)
- world_id (fk worlds)
- name
- attributes (jsonb) — texte, html_sanitized, images, etc.
- avatar_url
- parent_place_id (fk places, nullable)
- created_at, updated_at, version

### groups
- id (uuid, pk)
- world_id (fk worlds)
- name
- created_at, updated_at

### group_members
- group_id (fk groups)
- character_id (fk characters)
- pk (group_id, character_id)
- created_at

### sheets (inclut fiches modèle)
- id (uuid, pk)
- world_id (fk worlds)
- is_template (boolean)
- template_source_id (fk sheets, nullable) — référence de la fiche modèle copiée
- name
- attributes (jsonb) — champs libres définis par la fiche modèle
- capacities (jsonb[]) — [{ name, details, voix }]
- purse_gold, purse_silver, purse_copper (int)
- vision (int, default 0)
- avatar_url
- created_at, updated_at, version

### characters
Représente un acteur dans le monde, lié à une fiche.
- id (uuid, pk)
- world_id (fk worlds)
- sheet_id (fk sheets)
- user_id (fk users, nullable pour PNJ)
- type (enum: PC, NPC)
- current_place_id (fk places)
- right_hand_item_id (fk items, nullable)
- left_hand_item_id (fk items, nullable)
- created_at, updated_at, version

### items
- id (uuid, pk)
- world_id (fk worlds)
- name
- description
- type (enum: generic, weapon, armor, container)
- metadata (jsonb)
- capacities (jsonb[]) — [{ name, details, voix }]
- visibility (int 0..10, default 0)
- avatar_url
- holder_type (enum: world, place, item, character_hand, character_outfit)
- holder_id (uuid) — meaning depends on holder_type
- hand (enum: left, right, nullable) — only when holder_type=character_hand
- is_open (bool, default false) — only container
- is_lockable (bool, default false) — only container
- is_locked (bool, default false) — only container
- created_at, updated_at, version

Notes holder_type:
- world: holder_id = world_id
- place: holder_id = place_id
- item: holder_id = container_item_id (l’item parent)
- character_hand: holder_id = character_id + hand
- character_outfit: holder_id = character_id (item « porté »)

### sheet_outfits
- character_id (fk characters)
- item_id (fk items)
- slot (text, default 'outfit')
- pk (character_id, item_id)
- created_at

### history_entries (event store/audit)
- id (uuid, pk)
- world_id (fk worlds)
- entity_type (enum: world, place, group, group_member, sheet, character, item, chat, invitation, lock, sound)
- entity_id (uuid)
- action (text) — ex: update, transfer, open, lock, unlock, rollback, chat.create
- actor_user_id (fk users, nullable pour IA/système)
- source (enum: ui, api, system)
- at (timestamptz)
- request_id (text, nullable)
- before (jsonb, nullable)
- after (jsonb, nullable)
- metadata (jsonb)
- indexes: (world_id, at), (entity_type, entity_id, at)

### chats
- id (uuid, pk)
- world_id (fk worlds)
- kind (enum: dm, world, place)
- place_id (fk places, nullable)
- created_at

### chat_participants
- chat_id (fk chats)
- character_id (fk characters)
- pk (chat_id, character_id)

### chat_messages
- id (uuid, pk)
- chat_id (fk chats)
- from_character_id (fk characters)
- to_character_id (fk characters, nullable pour DM multi-participant)
- content (text)
- edited (bool), deleted (bool), edited_at, deleted_at
- created_at

### ai_metadata (optionnel, matérialisé)
- entity_type, entity_id (composite pk)
- ai_schema (jsonb) — vue compacte, stable pour LLMs
- ai_summary (text) — résumé pour IA
- ai_tips (jsonb) — liens d’action suggérés, clés importantes
- updated_at

## Contraintes et règles
- Items type weapon: metadata doit contenir { degats_base:int, degats_des:string }
- Items type armor: metadata doit contenir { defense:int, malus:int }
- Items type container: items peuvent référencer holder_type=item et holder_id=ce conteneur; lecture contrôlée par permissions (ouverture + autorisation MJ le cas échéant).
- Don direct: vers un autre personnage nécessite une main libre — validation côté API de `/transfers`.
- Visibilité: un item est rendable au client si item.visibility > sheet.vision, ou si l’item a été manipulé (pouvant passer à 10 par règle métier).
- Inventaires autres personnages: lecture interdite sauf drapeau override MJ.
- Rollback: génère une `history_entry` de type `world.rollback` + événements de mise en conformité.

## Indexation suggérée
- items(world_id, holder_type, holder_id)
- items(world_id, visibility)
- characters(world_id, current_place_id)
- chat_messages(chat_id, created_at)
- history_entries(world_id, at)

## Vues matérialisées utiles (optionnel)
- world_state_snapshots(world_id, at, snapshot_json) — pour accélérer rollback/chargement.
- visible_items(world_id, place_id, min_visibility)

