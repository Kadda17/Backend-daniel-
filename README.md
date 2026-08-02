# PV Cloud — Plateforme de gestion des fiches de soutenance

Application web interne à l'**ENSPD** (École Nationale Supérieure Polytechnique de Douala) qui digitalise les fiches de soutenance de mémoire des étudiants. Le projet remplace le processus papier par un flux numérique : scan, extraction par OCR, validation humaine, consultation et archivage.

## Structure du dépôt

```
pv-cloud/
├── frontend/          # Application React (TanStack Start + Vite + Tailwind CSS v4)
│   ├── src/
│   │   ├── components/   # Composants UI (shadcn/ui)
│   │   ├── hooks/        # Hooks React personnalisés
│   │   ├── lib/          # Contexte d'auth, données mockées, utilitaires
│   │   └── routes/       # 6 routes TanStack Router
│   ├── public/           # Logo + favicon
│   ├── package.json
│   └── ...
├── backend/           # Backend Django REST API
│   ├── core/           # App métier Django active
│   ├── pvcloud/        # Settings, URL root, ASGI/Wsgi
│   ├── app/            # Point d'entrée ASGI pour uvicorn
│   ├── .env            # Variables runtime locales (ne pas committer secrets réels)
│   └── .env.example    # Exemple de variables backend
├── requirements.txt   # Prérequis techniques globaux
└── README.md
```

## Pages de l'application

| Route | Page | Accès |
|-------|------|-------|
| `/login` | Connexion par matricule + mot de passe | Tout le monde |
| `/dashboard` | Tableau de bord avec recherche et filtres | Enseignant, chef de département, super-admin |
| `/ma-fiche` | Fiche unique de l'étudiant connecté | Candidat uniquement |
| `/scan` | Scan/import d'une fiche scannée | Super-admin uniquement |
| `/validation` | Validation des champs extraits par OCR | Super-admin uniquement |

## État du backend en cours

Le backend est désormais un scaffold Django DRF avec :
- authentification JWT par matricule
- endpoint de santé `GET /api/v1/health/`
- inscription côté serveur `POST /api/v1/auth/inscription/` avec rôle `enseignant` imposé côté serveur
- profil utilisateur `GET/PATCH /api/v1/auth/profil/`
- listes de fiches avec pagination et filtres basiques
- upload de scan + validation OCR
- point d'entrée ASGI prêt pour `uvicorn app.main:app`

### Variables backend

La configuration passe désormais par un fichier [backend/.env](backend/.env) local, avec un modèle dans [backend/.env.example](backend/.env.example).
Les variables clés à remplir sont :
- `DJANGO_SECRET_KEY`
- `DATABASE_URL`
- `DB_USER` / `DB_PASSWORD`
- `FERNET_KEY`
- `GEMINI_API_KEY`
- `LLM_PROVIDER`

### Lancer le backend

```bash
cd backend
python manage.py check
uvicorn app.main:app --reload --port 8000
```

## Lancer le frontend

```bash
cd frontend
npm install
npm run dev        # Démarre le serveur de développement (http://localhost:5173)
npm run build      # Build production (client + SSR + Nitro)
npm run preview    # Prévisualisation du build
```

**Prérequis :** Node.js >= 18, npm >= 10 (voir `requirements.txt` pour le détail).

## Rôles utilisateurs prévus

| Rôle | Accès |
|------|-------|
| **Candidat** (étudiant) | Consultation de sa propre fiche uniquement (sujet, date, salle, jury, note, mention) |
| **Enseignant** | Recherche et consultation des fiches, filtres par année/salle/date |
| **Chef de département** | Accès en consultation à l'ensemble des fiches de son département |
| **Super administrateur** | Accès complet + scan/upload de nouvelles fiches + validation humaine des données extraites par OCR |

## Comptes de test (développement)

| Rôle | Matricule | Mot de passe |
|------|-----------|-------------|
| Étudiant | `20INGE0421` | `pass` |
| Enseignant | `PROFMBELLA` | `pass` |
| Super admin | `PROFONDO` | `pass` |

## Ce que le backend devra fournir

### API d'authentification
- Endpoint de connexion par **matricule + mot de passe** (pas d'inscription libre)
- Token JWT avec les informations de rôle
- Les utilisateurs sont créés uniquement par la scolarité (pas de self-signup)

### API de recherche / filtrage
- Liste des fiches avec filtres combinés : année, salle, date, encadreur, candidat
- Recherche textuelle par nom ou matricule
- Pagination des résultats

### API de scan et validation
- **Upload de fiche scannée** (réservé au rôle super administrateur) : endpoint POST acceptant une image (PNG, JPG) ou un PDF
- **Validation des champs extraits par OCR** : endpoint PUT pour valider/modifier les champs avant de les persister
- Récupération de l'image scannée associée à une fiche

### Modèle de données (à titre indicatif)
- Candidat (matricule, nom, prénom, département)
- Fiche de soutenance (candidat, sujet, date, salle, heure, note, mention, jury, scan_url)
- Utilisateur (matricule, nom, rôle, hash mot de passe)
- Membre du jury (nom, qualité: encadreur académique / président / examinateur / encadreur professionnel)

## Points de sécurité

- **Contrôle d'accès par rôle** : chaque endpoint doit vérifier le rôle de l'utilisateur authentifié. Un étudiant ne doit pas pouvoir consulter la fiche d'un autre étudiant.
- **Pas de rôle choisi côté client** : le rôle est attribué côté serveur (base de données) et transmis via le token. Le frontend ne doit jamais envoyer le rôle comme paramètre de confiance.
- **Données sensibles** : les notes, mentions et informations personnelles (noms, matricules) sont des données académiques confidentielles.
- **Protection CSRF** déjà active côté frontend (middleware TanStack Start).

## Confidentialité

Les données manipulées par cette application (noms, matricules, notes, mentions, sujets de mémoire) sont **strictement confidentielles**. Elles appartiennent à l'ENSPD et aux étudiants concernés.

- Ne pas utiliser de données réelles comme jeux de test dans des outils externes (Postman, Insomnia, services cloud, IA générative, etc.)
- Les données de démonstration actuelles dans les maquettes sont fictives et illustratives
- Tout déploiement en production doit respecter la réglementation en vigueur sur la protection des données
