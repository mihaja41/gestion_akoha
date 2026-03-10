# Fiompiana Akoho — API Backend

API REST pour la gestion d'un élevage de poulets (fiompiana akoho).

## Démarrage rapide

```bash
# 1. Lancer SQL Server avec Docker
docker start sqlserver-akoho

# 2. Installer les dépendances
cd backend
npm install

# 3. Configurer le .env
# Voir backend/.env (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)

# 4. Lancer le serveur
npm run dev
```

Le serveur démarre sur `http://localhost:3000`.

## Documentation Swagger

Une fois le serveur lancé, accéder à :

- **Interface Swagger UI** : [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Spec JSON brute** : [http://localhost:3000/api/docs.json](http://localhost:3000/api/docs.json)

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

## Situation des lots — Ce que ça calcule

L'endpoint `GET /api/situation-lots?date=2026-03-10` retourne pour **chaque lot** de poulets dont la date d'entrée est ≤ à la date demandée :

```json
{
  "date": "2026-03-10",
  "nombreLots": 2,
  "situations": [
    {
      "numero": 101,
      "nombreInitial": 100,
      "prixAchatTotal": 800000,
      "valeurNourritureConsommee": 15000,
      "poidsMoyenParPoulet": 350.5,
      "prixVenteSansMort": 876250,
      "nombreMorts": 10,
      "nombreApresMort": 90,
      "ageEnJour": 28,
      "ageEnSemaine": 4,
      "prixVenteAvecMort": 788625,
      "nombreOeufs": 200,
      "valeurOeufs": 100000,
      "beneficeSansMort": 161250,
      "beneficeAvecMort": 73625
    }
  ]
}
```

### Détail des calculs

| Champ | Formule |
|---|---|
| `poidsMoyenParPoulet` | Σ `variation_poids` de la semaine 0 → âge actuel |
| `valeurNourritureConsommee` | Nourriture des survivants + Σ nourriture de chaque groupe de morts (par tranche de vie) |
| `prixVenteSansMort` | `poidsMoyen × nombreInitial × race.prix_vente` |
| `prixVenteAvecMort` | `poidsMoyen × nombreApresMort × race.prix_vente` |
| `nombreOeufs` | Total œufs − naissances − œufs pourris |
| `valeurOeufs` | `nombreOeufs × race.prix_vente_atody` |
| `beneficeSansMort` | `prixVenteSansMort + valeurOeufs − prixAchatTotal − valeurNourriture` |
| `beneficeAvecMort` | `prixVenteAvecMort + valeurOeufs − prixAchatTotal − valeurNourriture` |

> Pour l'explication détaillée des règles de gestion, voir [backend/doc/situation-lot-akoho.md](backend/doc/situation-lot-akoho.md).

## Architecture

```
backend/src/
├── server.js                     ← Point d'entrée
├── app.js                        ← Configuration Express + routes
├── config/
│   ├── database.js               ← Connexion SQL Server
│   └── swagger.js                ← Configuration Swagger/OpenAPI
├── routes/                       ← Définition des URL (≈ @RequestMapping)
├── controllers/                  ← Gestion requêtes HTTP (≈ @RestController)
├── services/                     ← Logique métier (≈ @Service)
├── repositories/                 ← Requêtes SQL (≈ @Repository)
├── models/                       ← Modèles de données (≈ @Entity)
└── middlewares/
    └── errorHandler.js           ← Gestion erreurs (≈ @ControllerAdvice)
```

## Documentation complémentaire

- [backend/doc/init-project.md](doc/init-project.md) — Initialisation du projet (Docker, base de données, premier lancement)
- [backend/doc/reset-base.md](doc/reset-base.md) — Réinitialiser la base de données
- [backend/doc/situation-lot-akoho.md](doc/situation-lot-akoho.md) — Règles de gestion du calcul de situation
- [backend/doc/situation-lots.md](doc/situation-lots.md) -> EndPoint pour obtenir la situation de tous les lots de poulets