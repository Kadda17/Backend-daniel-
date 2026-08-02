PV Cloud — Backend (Django)

Ce dossier contient le backend Django DRF du projet, avec un scaffold fonctionnel pour l’API demandée : auth JWT, profils, fiches, upload scan, validation OCR et point d’entrée ASGI pour le service.

## État actuel du backend

### Ce qui est déjà en place
- Modèles : `User`, `Candidate`, `JuryMember`, `Fiche`
- Auth JWT via `matricule` comme identifiant principal
- Login : `POST /api/v1/auth/login/`
- Inscription côté serveur : `POST /api/v1/auth/inscription/` avec rôle `enseignant` attribué par le serveur
- Profil : `GET /api/v1/auth/profil/` et `PATCH /api/v1/auth/profil/`
- Fiches : listing avec pagination, filtres et recherche
- Upload scan : `POST /api/v1/fiches/{id}/upload_scan/`
- Validation OCR : `PUT /api/v1/fiches/{id}/validate/`
- Récupération du scan : `GET /api/v1/fiches/{id}/scan/`
- Santé de service : `GET /api/v1/health/`
- Point d’entrée ASGI : `uvicorn app.main:app --reload --port 8000`

### Structure du backend
- `core/` : app métier active
- `pvcloud/` : settings, URL root et point d’entrée Django
- `app/` : export ASGI `app.main` pour `uvicorn`
- `.env` : variables runtime locales de travail
- `.env.example` : modèle de configuration backend

## Variables de configuration à remplir

Le backend lit maintenant des variables d’environnement depuis le fichier `.env`.
Les variables essentielles sont :
- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `DATABASE_URL`
- `DB_USER` / `DB_PASSWORD`
- `CORS_ORIGINS`
- `FERNET_KEY`
- `GEMINI_API_KEY`
- `LLM_PROVIDER`

## Lancer le backend

```bash
cd backend
python manage.py check
uvicorn app.main:app --reload --port 8000
```

## Endpoints principaux

- `POST /api/v1/auth/login/` -> `{access, refresh, role, matricule, full_name}`
- `POST /api/v1/auth/inscription/` -> création d’un compte enseignant côté serveur
- `GET /api/v1/auth/profil/` -> profil connecté
- `GET /api/v1/health/` -> `{status: "ok"}`
- `GET /api/v1/fiches/` -> liste paginée des fiches
- `GET /api/v1/fiches/{id}/`
- `POST /api/v1/fiches/{id}/upload_scan/`
- `PUT /api/v1/fiches/{id}/validate/`
- `GET /api/v1/fiches/{id}/scan/`

## Sécurité et confidentialité

- Les rôles sont attribués côté serveur et injectés côté token JWT.
- Le frontend ne doit jamais choisir le rôle dans la requête.
- Les données académiques (noms, matricules, notes, mentions, sujets) sont sensibles.
- Ne pas exposer de vraies données dans des outils tiers ou des tests publics.

## Prochaine étape de reprise

Pour reprendre proprement la suite du backend, il faut ensuite :
1. brancher une vraie base PostgreSQL en remplissant `DATABASE_URL`
2. générer et stocker les secrets `FERNET_KEY` et `GEMINI_API_KEY`
3. finaliser le vrai schéma SQL Postgres + RLS si vous poursuivez l’architecture du canevas
4. compléter le flux OCR par intégration LLM et validation métier
