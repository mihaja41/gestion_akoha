# Fiompiana Akoho — Gestion d'élevage de poulets

Application web (Backend Express + Frontend Angular) pour la gestion d'un élevage de poulets.

---

## Prérequis

- **Docker** installé ([docs.docker.com](https://docs.docker.com/get-docker/))
- **Node.js** (v18 ou supérieur) et **npm** installés ([nodejs.org](https://nodejs.org/))

---

## 1. Base de données — SQL Server avec Docker

### 1.1 Puller l'image Docker SQL Server

```bash
docker pull mcr.microsoft.com/mssql/server:2022-latest
```

### 1.2 Créer et lancer le container

```bash
docker run -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=admin@12345" \
  -p 1433:1433 \
  --name sqlserver-akoho \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

> Pour relancer le container après un redémarrage : `docker start sqlserver-akoho`

### 1.3 Créer la base de données

Exécuter le script SQL de création des tables :

```bash
docker cp database/base.sql sqlserver-akoho:/tmp/base.sql
docker exec -it sqlserver-akoho /opt/mssql-tools*/bin/sqlcmd -S localhost -U sa -P "admin@12345" -i /tmp/base.sql
```

---

## 2. Backend (Express / Node.js)

### 2.1 Créer le fichier `.env`

Créer un fichier `backend/.env` avec le contenu suivant :

```dotenv
# Configuration du serveur
PORT=3000

# Configuration SQL Server (Docker)
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=admin@12345
DB_NAME=gestion_akoho
```

### 2.2 Installer les dépendances et lancer

```bash
cd backend
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:3000`.

### 2.3 Documentation Swagger

Une fois le serveur lancé :

- **Swagger UI** : [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Spec JSON** : [http://localhost:3000/api/docs.json](http://localhost:3000/api/docs.json)

---

## 3. Frontend (Angular)

### 3.1 Installer les dépendances

```bash
cd frontend
npm install
```

### 3.2 Lancer le serveur de développement

```bash
npm start
```

L'application démarre sur `http://localhost:4200` et se connecte automatiquement à l'API backend sur le port 3000.

---

## Endpoints disponibles

### Données de base (CRUD)

| Ressource | URL | Méthodes |
|---|---|---|
| Races | `/api/races` | GET, POST, GET/:id, PUT/:id, DELETE/:id |
| Descriptions race | `/api/description-races` | GET, POST, GET/:id, PUT/:id, DELETE/:id |
| Lots de poulets | `/api/lots-akoho` | GET, POST, GET/:id, PUT/:id, DELETE/:id |
| Lots d'œufs | `/api/lots-atody` | GET, POST, GET/:id, PUT/:id, DELETE/:id |
| Naissances (poussins) | `/api/naissances-oeuf` | GET, POST, GET/:id, PUT/:id, DELETE/:id |
| Poulets morts | `/api/akoho-maty` | GET, POST, GET/:id, PUT/:id, DELETE/:id |
| Œufs pourris | `/api/atody-lamokany` | GET, POST, GET/:id, PUT/:id, DELETE/:id |

### Situation / Calculs

| Endpoint | Description |
|---|---|
| `GET /api/lots-akoho/:id/situation?date=YYYY-MM-DD` | Situation d'**un** lot à une date |
| `GET /api/situation-lots?date=YYYY-MM-DD` | Situation de **tous** les lots à une date |

## Architecture

```
backend/src/
├── server.js                     ← Point d'entrée
├── app.js                        ← Configuration Express + routes
├── config/
│   ├── database.js               ← Connexion SQL Server
│   └── swagger.js                ← Configuration Swagger/OpenAPI
├── routes/                       ← Définition des URL
├── controllers/                  ← Gestion requêtes HTTP
├── services/                     ← Logique métier
├── repositories/                 ← Requêtes SQL
├── models/                       ← Modèles de données
└── middlewares/
    └── errorHandler.js           ← Gestion erreurs

frontend/src/app/
├── app.routes.ts                 ← Configuration des routes Angular
├── components/
│   └── sidebar/                  ← Menu latéral de navigation
├── models/                       ← Interfaces TypeScript
├── pages/
│   ├── race/                     ← CRUD Races
│   ├── description-race/         ← CRUD Description Races
│   └── lot-akoho/                ← CRUD Lots de Poulets
├── services/                     ← Services HTTP (appels API)
└── environments/                 ← Config environnement (URL API)
```

## Documentation complémentaire

- [backend/doc/init-project.md](backend/doc/init-project.md) — Initialisation du projet
- [backend/doc/reset-base.md](backend/doc/reset-base.md) — Réinitialiser la base de données
- [backend/doc/situation-lot-akoho.md](backend/doc/situation-lot-akoho.md) — Règles de gestion du calcul de situation
- [backend/doc/situation-lots.md](backend/doc/situation-lots.md) — Endpoint situation de tous les lots