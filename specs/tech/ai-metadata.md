# Spécifications Techniques — Métadonnées IA (v0.2)

Objectif: faciliter l'usage par des LLMs via des représentations compactes, des clés stables et des liens d'action explicites.

## Champs communs dans les réponses API
- `ai_schema` (json): projection stable, normalisée, adaptée à l'entité.
- `ai_summary` (string): résumé court avec informations saillantes et actions clés.
- `ai_tips` (json): hints + liens d'action (HATEOAS) utiles pour orchestrer.

Ces champs sont optionnels, activables via `?ai=1` ou header `X-AI-Shape: 1`.

## Exemples

Sheet (PJ)
{
  "id": "s_1",
  "name": "Eldra",
  "vision": 3,
  "capacities": [ { "name": "Tir précis", "voix": "archerie" } ],
  "ai_schema": {
    "type": "sheet",
    "slots": {
      "hands": { "left": "it_2?", "right": "it_1?" },
      "outfit": [ "it_5", "it_7" ]
    },
    "purse": { "gold": 10, "silver": 3, "copper": 5 },
    "place": "p_9",
    "visibility_threshold": 3
  },
  "ai_tips": {
    "actions": [
      { "rel": "give", "href": "/api/v1/transfers", "method": "POST", "needs": ["item_id", "to.character_id", "to.hand"] },
      { "rel": "move", "href": "/api/v1/characters/c_1", "method": "PATCH", "needs": ["current_place_id"] }
    ]
  }
}

Item (container fermé)
{
  "id": "it_10",
  "type": "container",
  "is_open": false,
  "ai_summary": "Coffre verrouillé. Nécessite ouverture pour voir le contenu.",
  "ai_tips": {
    "actions": [
      { "rel": "open", "href": "/api/v1/items/it_10/open", "method": "POST" }
    ]
  }
}

## Lignes directrices
- Noms de clés concis et cohérents.
- Inclure seulement les champs utiles à la décision.
- Ajouter des liens d'action pertinents selon le contexte et les permissions.

