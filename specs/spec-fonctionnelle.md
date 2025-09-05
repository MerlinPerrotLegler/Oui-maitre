# Spécification Fonctionnelle — Plateforme JDR collaboratif (API‑first)

Version: 0.2 • Date: 2025‑09‑05

Objectif
- But: Plateforme où MJ, PJ et IA collaborent pour gérer mondes, personnages, lieux, objets, groupes, chat et historique, avec synchro temps réel et contrôle fin des permissions.
- API‑first: Toute action réalisable via l’UI est exposée via API pour IA/automatisation.

Acteurs
- MJ: Crée et administre un monde, lieux, objets, groupes, invitations, date, verrous, rollback.
- PJ: Gère sa fiche, inventaire, déplacements d’objets, interactions dans son monde.
- PNJ: Entité gérée par MJ; peut être pilotée par IA si autorisé.
- IA: Client API effectuant les actions d’un rôle selon permissions déléguées.
- Invité: Rejoint un monde via un lien d’invitation et devient PJ.

Glossaire / Entités
- Monde: Espace de jeu, date du jour, paramètres, MJ propriétaire, joueurs, lieux, groupes.
- Lieu: Contient PJ/PNJ et objets; attributs libres: texte, image (avatar), HTML, coffre(s), sous‑lieux.
- Groupe: Ensemble de PJ/PNJ.
- Fiche modèle: Une fiche « modèle » (is_template=true) éditable par le MJ, visible et duplicable par les joueurs pour créer leur fiche.
- Fiche de personnage: Instance PJ/PNJ: attributs, capacités (avec champ `voix`), inventaire (conteneur), mains, tenue, bourse, vision, image (avatar).
- Objet: Élément assignable à une entité (inventaire, main, tenue, coffre, lieu, monde, etc.), avec `visibility` 0–10, capacités (avec `voix`), type (générique, arme, armure, conteneur), et image (avatar).
- Inventaire: Désormais un objet de type « conteneur » attaché à un propriétaire (PJ/PNJ/lieu/etc.).
- Coffre/Meuble/Havresac: Objet de type « conteneur » fermable, dont le contenu est caché tant qu’il n’est pas ouvert.
- Invitation: Lien (token) permettant de rejoindre un monde en tant que PJ.
- Historique: Journal immuable des changements; supporte rollback monde par date.
- Verrou MJ (Freeze): Blocage temporaire des actions des joueurs (global ou contextuel).

Règles générales
- Visibilité: Un PJ voit les objets d’un lieu si `objet.visibility` > `vision` du PJ; tout objet manipulé par un joueur passe à `visibility=10` (jusqu’à atténuation ultérieure si prévu).
- Traçabilité: Toute mutation crée un événement historisé avec horodatage, auteur et avant/après.
- Synchro: Toute mutation émet des événements temps réel; clients abonnés se mettent à jour.
- Permissions: MJ a override sur son monde; PJ sur sa fiche et ses objets; IA hérite du rôle.
- Atomicité: Déplacements d’objet et changements d’état sont atomiques (pas de duplication/fantômes).
- Notifications: Tous les joueurs d’un même lieu reçoivent les notifications des actions les uns des autres; le MJ reçoit toutes les notifications du monde.
- Confidentialité inventaires: L’inventaire d’un autre personnage n’est pas accessible (ni visible dans le détail) sauf autorisation explicite du MJ.

Fiche modèle — Fonctionnel (FR‑TPL)
- FR‑TPL‑1: Créer/éditer une fiche modèle (MJ) marquée `is_template=true`.
- FR‑TPL‑2: Définir les champs de la fiche: clé, libellé, type, contraintes, défaut, aide abrégée, aide détaillée IA.
- FR‑TPL‑3: Publier une fiche modèle pour duplication par les joueurs.
- FR‑TPL‑4: Optionnel: versionner la fiche modèle; les fiches copiées référencent la version source.
- Acceptation: Les joueurs peuvent voir et « copier » une fiche modèle pour créer leur fiche; seule le MJ peut modifier la fiche modèle.

Fiche de Personnage — Fonctionnel (FR‑CS)
- FR‑CS‑1: Créer une fiche PJ en copiant une fiche modèle (PJ/MJ); créer/éditer PNJ (MJ uniquement).
- FR‑CS‑2: Modifier librement sa fiche (PJ); MJ peut modifier toutes fiches de son monde.
- FR‑CS‑3: Gérer attributs: caractéristiques, capacités (avec champ `voix`), inventaire (conteneur), main droite/gauche (1 objet max chacune), tenue (multi‑objets), bourse (or/argent/cuivre), attribut `vision` numérique, image (avatar).
- FR‑CS‑4: Voir attributs publics d’autres PJ co‑présents au même lieu (mains, tenue; autres champs selon règles de visibilité du modèle si configurées en « publiques »).
- FR‑CS‑5: Historiser toute modification de fiche.
- FR‑CS‑6: IA peut piloter un PNJ (mouvements, actions) si le MJ l’autorise explicitement.
- Acceptation: Les compteurs de bourse sont indépendants; conflits résolus de façon optimiste.

Inventaires, Coffres et Objets — Fonctionnel (FR‑INV/FR‑OBJ)
- FR‑OBJ‑1: Créer/éditer un objet (MJ). Attributs génériques: métadonnées, capacités[] (avec `voix`), image (avatar).
- FR‑OBJ‑2: Typage d’objet: `weapon` (arme), `armor` (armure), `container` (inventaire/coffre/meuble), `generic`.
- FR‑OBJ‑3: Armes: champs requis `degats_base` et `degats_des`.
- FR‑OBJ‑4: Armures: champs requis `defense` et `malus`.
- FR‑OBJ‑5: Attribuer un objet à n’importe quelle entité: inventaire (conteneur), main, tenue, coffre (conteneur), lieu, monde.
- FR‑INV‑1: Déplacer un objet entre: main ↔ inventaire (conteneur) ↔ coffre (conteneur) ↔ lieu ↔ autre PJ/PNJ (autorisation requise; même lieu pour échanges directs).
- FR‑INV‑2: Donner un objet à un autre PJ si co‑présents et non verrouillés; l’objet va dans une main libre du receveur, sinon l’action échoue avec message explicite.
- FR‑INV‑3: Historiser chaque mouvement (source, destination, acteur, avant/après).
- FR‑INV‑4: Coffres/Meubles (conteneurs): Contenu invisible jusqu’à « ouverture » (événement) via action, malédiction levée ou progression de quête.
- FR‑INV‑5: Ouvertures spéciales: Certains objets déclenchent un « Freeze » narratif côté MJ; une popup permet au MJ de mettre fin au Freeze.
- FR‑INV‑6: Accès inventaires: Les inventaires d’autres personnages ne sont pas accessibles sauf autorisation explicite du MJ.
- Acceptation: Un déplacement échoue si destination incompatible (ex: main occupée). Le contenu d’un conteneur n’est visible qu’après ouverture réussie; le Freeze bloque déplacements et changements de lieu jusqu’à déverrouillage par MJ.

Monde & Lieux — Fonctionnel (FR‑W/FR‑P)
- FR‑W‑1: Créer un monde (MJ) et en devenir propriétaire.
- FR‑W‑2: Inviter par lien des joueurs (MJ); gérer expiration, révocation, quotas.
- FR‑W‑3: Incrémenter la date du jour (MJ).
- FR‑W‑4: Verrouiller/déverrouiller temporairement les actions des joueurs (global ou ciblé par lieu/groupe/personnage).
- FR‑W‑5: Rollback: Restaurer l’état du monde à une date donnée; produit une nouvelle entrée d’historique globale et notifie tous les clients.
- FR‑W‑6: Sonorisation: Le MJ peut jouer un son sur la session d’un utilisateur ciblé ou de tous les utilisateurs du monde.
- FR‑P‑1: Créer des lieux dans un monde (MJ), hiérarchie optionnelle (sous‑lieux).
- FR‑P‑2: Ajouter attributs libres à un lieu: texte, image, HTML (sanitisé, liste blanche), coffre(s), objets.
- FR‑P‑3: Voir qui est présent dans un lieu (PJ/PNJ) et les objets visibles selon règles de visibilité.
- Acceptation: Le verrou empêche déplacements d’objets et changements de lieu, mais permet lecture et chat. Le rollback affecte toutes les entités du monde (monde, lieux, fiches, inventaires, objets, groupes, chats si politique définie — messages non supprimés par défaut, voir Chat).

Groupes — Fonctionnel (FR‑G)
- FR‑G‑1: Créer un groupe (MJ).
- FR‑G‑2: Ajouter/retirer des PJ/PNJ au groupe (MJ).
- FR‑G‑3: Voir toutes les fiches des membres du groupe selon leurs permissions générales.
- Acceptation: Un personnage peut appartenir à plusieurs groupes. (Suppression des rôles par membre dans la définition du groupe.)

Chat — Fonctionnel (FR‑CHAT)
- FR‑CHAT‑1: Envoyer messages MJ↔PJ, PJ↔PJ (privés), canaux de monde et de lieu.
- FR‑CHAT‑2: Historiser les messages par monde, canal et participants.
- FR‑CHAT‑3: Diffuser en temps réel aux destinataires.
- FR‑CHAT‑4: Modération: Édition et suppression de messages autorisées (par auteur et/ou MJ). Les éditions/suppressions sont historisées (audit) et indiquées aux clients.
- Acceptation: Un PJ ne lit que ses conversations directes et canaux auxquels il a accès. Les suppressions sont « soft delete » (masquées dans l’UI, conservées en audit).

Historique & Rollback — Fonctionnel (FR‑HIST)
- FR‑HIST‑1: Journaliser toute mutation d’entité: type, payload avant/après, auteur, horodatage, source (UI/API), request_id.
- FR‑HIST‑2: Filtrer/consulter l’historique par entité, période, acteur.
- FR‑HIST‑3: Visualiser les diffs des fiches et mouvements d’objets.
- FR‑HIST‑4: Rollback monde: Restaurer l’état du monde à un horodatage; opération idempotente, auditable, et transmise en temps réel.
- Acceptation: L’historique est en lecture seule, sauf opérations système de rollback initiées par MJ. Le rollback crée une nouvelle version de l’état; pas d’écrasement silencieux.

Permissions & Auth — Fonctionnel (FR‑PERM/AUTH)
- FR‑AUTH‑1: Authentification par Email/Mot de passe et OAuth (ex: Google/GitHub). Gestion de session et rafraîchissement de tokens.
- FR‑AUTH‑2: Invitations sécurisées par token signé, durée de vie configurable.
- FR‑PERM‑1: MJ: plein contrôle sur son monde et entités associées.
- FR‑PERM‑2: PJ: contrôle de sa fiche/inventaire; mouvements possibles selon contexte (lieu, possession, verrous).
- FR‑PERM‑3: IA: permissions héritées du rôle et du monde; actions via API avec clés scp (scopes) limitées.
- Acceptation: Un PJ ne peut pas modifier la fiche d’un autre PJ; les PNJ sont créés/édités par MJ; IA peut piloter PNJ sur délégation explicite.

Contraintes Non‑Fonctionnelles
- Mobile‑first: UI conçue prioritairement pour petits écrans; responsive.
- Réactif: Mise à jour temps réel; latence perçue < 200 ms pour rendus clients.
- Accessible: Respect WCAG 2.1 AA (navigation clavier, ARIA, contrastes, focus visibles).
- API: Couverture 100% des actions; pagination/filtrage/tri; idempotence via `request_id`.
- Sécurité: Auth robuste, permissions fines, tokens d’invitation sécurisés, audit complet, sanitation HTML en liste blanche.
- Résilience: Transferts atomiques; contrôle de concurrence optimiste (ETag/version); reprise sur erreurs côté client.
- Quotas/Stockage: Limite d’upload/stockage à 1 Go par utilisateur (images, assets, pièces jointes). Réglage au niveau du monde possible.
- Métadonnées IA: Les réponses API incluent des champs optimisés IA (`ai_schema`, `ai_summary`, `ai_tips`) pour faciliter le pilotage par des modèles IA (schémas stables, noms de clés explicites, liens d’action suggérés).

Vues / Écrans & Actions associées
- Fiche Personnage: Voir/modifier sa fiche; gérer inventaire (conteneur), mains, tenue, bourse; voir historique ciblé; déclencher dons/échanges si co‑présence.
- Groupe: Voir les fiches des membres; stats agrégées simples; gestion membres (MJ). Afficher les membres non présents dans le même lieu en grisé.
- Joueur (Autour de moi): Voir mon personnage et ma fiche; voir les autres personnes dans le lieu, les objets visibles et coffres; actions de déplacement/prise/dépôt; ouverture de coffres; affichage d’attributs libres; notifications d’actions; afficher les membres du groupe non présents en grisé.
- Monde: Date actuelle, lieux, groupes, joueurs, paramètres; actions MJ (inviter, verrouiller/déverrouiller, rollback, incrémenter date, jouer un son). Popup de Freeze pour scénarios narratifs spéciaux.

- API — Portée Fonctionnelle (ressources principales)
- Ressources: `/worlds`, `/invitations`, `/places`, `/groups`, `/characters`, `/sheets`, `/items`, `/locks`, `/timeline`, `/chats`, `/events`, `/transfers`, `/rollbacks`, `/sounds`.
- Actions communes: CRUD, assignation, déplacement (`POST /transfers`), incrément date (`POST /worlds/{id}/advance-date`), verrous (`POST /worlds/{id}/lock|unlock`), invitation (`POST /worlds/{id}/invitations`), rejoindre (`POST /invitations/{token}/accept`), rollback (`POST /worlds/{id}/rollback`), ouverture conteneur (`POST /items/{id}/open` si `type=container`), jouer un son (`POST /worlds/{id}/sounds` avec ciblage optionnel `character_id[]`).
- Temps réel: WebSocket/SSE pour souscrire aux événements d’un monde; webhooks optionnels pour IA.
- Idempotence: Toutes mutations acceptent un `request_id` pour éviter doublons.

Événements Temps Réel (exemples)
- `world.updated`: Métadonnées monde, date, verrou modifiés.
- `world.rolled_back`: Rollback appliqué; inclut horodatage cible et auteur.
- `place.updated`: Attributs/présence/visibilité modifiés.
- `character.updated`: Fiche/état (mains, bourse, tenue, vision) modifiés.
- `item.transferred`: Déplacement avec source/destination et visibilité recalculée.
- `container.opened`: Coffre/meuble ouvert; peut déclencher `world.freeze`.
- `world.freeze` / `world.unfreeze`: Blocage/déblocage par MJ (ouverture spéciale).
 - `group.updated`: Membres modifiés.
- `chat.message.created|updated|deleted`: Nouveau message, édition, suppression.
- `history.entry.created`: Nouvelle entrée d’historique pour toute mutation.
- `notification.broadcast`: Notification d’action dans un lieu (PJ co‑présents) et au MJ globalement.
- `sound.play`: Requête MJ de lecture d’un son (ciblé ou broadcast), avec métadonnées (url, volume, destinataires).

Données minimales par entité (schéma logique de haut niveau)
- Monde: `id`, `nom`, `mj_id`, `date_jour`, `lock_state`, `created_at`.
- Invitation: `id`, `world_id`, `token`, `etat`, `expires_at`.
- Lieu: `id`, `world_id`, `nom`, `attributs_libres`, `avatar_url`, `images[]`.
- Groupe: `id`, `world_id`, `nom`, `membres[] (character_ids)`.
- Fiche (inclut fiches modèles avec `is_template`): `id`, `is_template`, `template_source_id?`, `owner_id`, `type (PJ/PNJ)`, `attributs`, `capacites[] {nom, details, voix}`, `bourse {or, argent, cuivre}`, `mains {gauche, droite}`, `tenue[] (item_ids)`, `inventory_container_id (item_id)`, `lieu_id`, `vision`, `avatar_url`.
- Objet: `id`, `world_id`, `nom`, `description`, `metadata`, `visibility (0..10)`, `holder_ref (polymorphe)`, `type (generic|weapon|armor|container)`, `capacites[] {nom, details, voix}`, `avatar_url`,
  • Si `type=weapon`: `degats_base`, `degats_des`.
  • Si `type=armor`: `defense`, `malus`.
  • Si `type=container`: `items[] (item_ids)`, `is_open`, `is_lockable`, `is_locked`.
- Historique: `id`, `entity_ref`, `type`, `before`, `after`, `actor_ref`, `at`, `request_id`.
- Chat: `id`, `world_id`, `participants[]`, `messages[] {id, from, to/canal, contenu, edited, deleted, at}`.

Critères d’acceptation clés
- API parité: Chaque action UI possède une route API documentée.
- Historique: Toute mutation est visible dans l’historique de l’entité concernée.
- Synchro: Un changement PJ/MJ/IA se reflète chez toutes les parties abonnées.
- Verrou/Freeze: Le verrou bloque déplacements et changements de lieu; UI indique l’état; certaines ouvertures déclenchent un Freeze jusqu’à action du MJ.
- Invitation: Un joueur rejoint via lien et apparaît dans le monde comme PJ.
- Visibilité objets: Visibilité 0–10; visible si `visibility` > `vision` du PJ; interaction met `visibility=10`.
- Coffres/Conteneurs: Contenu invisible tant que fermé; visibilité conditionnée à l’ouverture; règles de notifications diffusées aux présents et au MJ.
- Chat: Éditions/suppressions possibles; audit complet conservé; destinataires mis à jour en temps réel.
- Rollback: Le MJ peut restaurer l’état du monde à une date donnée; tous les clients sont notifiés; l’opération est historisée.
- Don d’objet: En don direct, l’objet va dans une main libre du receveur; s’il n’y a pas de main libre, l’opération échoue avec message clair.
- Accès inventaires: Les inventaires d’autres personnages sont inaccessibles par défaut, sauf autorisation explicite du MJ.
- Son: Le MJ peut déclencher la lecture d’un son côté clients ciblés ou globalement; un événement `sound.play` est émis et les clients l’exécutent.

Hypothèses clarifiées (intégrées)
- Auth: Email/mot de passe et OAuth.
- Modération chat: Édition/suppression activées et auditées.
- Capacité/poids objets: Limite de stockage à 1 Go par utilisateur pour uploads.
- Visibilité objets: Règles chiffrées 0–10; interaction -> 10; vision PJ détermine visibilité.
- HTML lieux: Liste blanche de balises; upload images autorisé et soumis aux quotas.
- PNJ: Création/édition par MJ; IA peut les piloter sur délégation.
- Groupes: Pas de rôles par membre; gestion des membres par le MJ.
- Revert: Restauration par date, impactant tout le monde, via mécanisme de versionnage/historique.
- Coffres/meubles/Havresac: Contenus invisibles tant qu’inaccessibles; certaines ouvertures déclenchent Freeze et narration MJ.
- Notifications: Tous les joueurs co‑présents reçoivent les notifications d’actions; MJ reçoit toutes les notifications du monde.

Notes pour la suite (préparation specs techniques)
- Normaliser les FR‑IDs comme références croisées dans les modèles d’API et tests.
- Définir la liste blanche HTML (balises, attributs) et la politique d’upload (formats, tailles).
- Définir le modèle d’événements temps réel (schémas JSON, clés stables) et les garanties d’ordre.
- Définir les scopes d’API pour IA (lecture, écriture, pilotage PNJ, administration restreinte).
- Définir la politique de rollback vis‑à‑vis du chat (messages hors rollback; audit seulement).
- Définir le format `ai_schema` et `ai_summary` (objets compacts, champs normalisés) et les endpoints « LLM‑friendly ».
