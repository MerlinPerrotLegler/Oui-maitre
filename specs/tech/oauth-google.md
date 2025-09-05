# OAuth Google — Guide de connexion (v0.2)

Ce guide explique comment connecter l’app au login Google (OIDC).

## 1) Créer un projet Google Cloud
- Allez sur https://console.cloud.google.com/
- Créez un projet ou réutilisez-en un.

## 2) Écran de consentement OAuth
- APIs & Services → OAuth consent screen.
- Type: External.
- Renseignez nom d’app, domaine (si dispo), email support.
- Ajoutez le scope `openid`, `email`, `profile` (par défaut pour OIDC).
- Ajoutez les domaines/URLs si vous en avez (prod/staging/local inutile pour test).

## 3) Identifiants OAuth 2.0
- APIs & Services → Credentials → Create Credentials → OAuth client ID.
- Application type: Web application.
- Authorized redirect URIs:
  - Local: `http://localhost:3000/oauth/google/callback`
  - En prod: `https://votre-domaine/oauth/google/callback`
- Récupérez `Client ID` et `Client secret`.

## 4) Variables d’environnement
Dans `.env` (ou `infra/.env` si vous utilisez docker-compose pour le server):

OAUTH_BASE_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

Assurez-vous que `OAUTH_BASE_URL` matche l’origin où le serveur Nest écoute.

## 5) Endpoints disponibles
- Démarrer le flux: `GET /oauth/google/start` → redirection vers Google
- Callback: `GET /oauth/google/callback?code=...&state=...`

Réponse actuelle (dev): JSON avec `user`, `access_token`, `refresh_token`. En prod, préférez une redirection vers votre frontend avec un cookie sécurisé.

## 6) Lien avec les utilisateurs
- Si un utilisateur existe déjà avec cet email, on enregistre `oauthProvider=google`, `oauthSub=<sub>`.
- Sinon on crée un utilisateur avec ces infos.
- Les mots de passe ne sont pas nécessaires pour un utilisateur OAuth-only.

## 7) Sécurité & bonnes pratiques
- N’utilisez pas les secrets par défaut; changez `JWT_*`.
- En prod: mettez les tokens en cookies `HttpOnly; Secure; SameSite=Lax`.
- Définissez précisément les redirect URIs dans Google Cloud (éviter wildcards).

## 8) Dépannage
- Erreur `redirect_uri_mismatch`: vérifiez que votre `OAUTH_BASE_URL` et l’URI autorisée dans GCP sont identiques.
- Erreur réseau en dev: le serveur doit pouvoir atteindre `https://accounts.google.com/.well-known/openid-configuration`.

