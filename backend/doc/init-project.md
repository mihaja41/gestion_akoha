# Initialisation du projet — Fiompiana Akoho

## 1. Base de données SQL Server avec Docker

### 1.1 Lancer le conteneur SQL Server

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=admin@12345" -p 1433:1433 --name sqlserver-akoho -d mcr.microsoft.com/mssql/server:2022-latest
```

| Option | Signification |
|---|---|
| `-e "ACCEPT_EULA=Y"` | Accepter la licence Microsoft (obligatoire) |
| `-e "MSSQL_SA_PASSWORD=admin@12345"` | Mot de passe du super admin `sa` |
| `-p 1433:1433` | Mapper le port 1433 de Docker vers le port 1433 local |
| `--name sqlserver-akoho` | Nom du conteneur (pour le retrouver facilement) |
| `-d` | Lancer en arrière-plan (detached) |

> **Attention :** Le mot de passe doit respecter la politique SQL Server : au moins 8 caractères, avec majuscules, minuscules, chiffres ou caractères spéciaux.

### 1.2 Vérifier que le conteneur tourne

```bash
docker ps
```

Voir les logs si problème :
```bash
docker logs sqlserver-akoho
```

Attendre le message : `SQL Server is now ready for client connections.`

### 1.3 Arrêter / Redémarrer le conteneur

```bash
# Arrêter
docker stop sqlserver-akoho

# Redémarrer (les données sont conservées)
docker start sqlserver-akoho

# Supprimer complètement (les données seront perdues)
docker stop sqlserver-akoho && docker rm sqlserver-akoho
```

---

## 2. Se connecter à SQL Server (comme `mysql -u root -p`)

### 2.1 Avec `sqlcmd` depuis le conteneur Docker

C'est l'équivalent de `mysql -u root -p` :

```bash
docker exec -it sqlserver-akoho /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "admin@12345" -C
```

| MySQL | SQL Server |
|---|---|
| `mysql -u root -p` | `sqlcmd -S localhost -U sa -P "admin@12345"` |
| `SHOW DATABASES;` | `SELECT name FROM sys.databases; GO` |
| `USE ma_base;` | `USE ma_base; GO` |
| `SHOW TABLES;` | `SELECT name FROM sys.tables; GO` |
| `DESCRIBE ma_table;` | `EXEC sp_columns ma_table; GO` |
| `SELECT * FROM ...;` | `SELECT * FROM ...; GO` |

> **Important :** En SQL Server, il faut toujours taper `GO` sur une nouvelle ligne pour exécuter la requête.

**Exemple de session complète :**

```sql
-- Se connecter
-- docker exec -it sqlserver-akoho /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "admin@12345" -C

-- Lister les bases
SELECT name FROM sys.databases;
GO

-- Utiliser la base gestion_akoho
USE gestion_akoho;
GO

-- Lister les tables
SELECT name FROM sys.tables;
GO

-- Voir les données
SELECT * FROM description_race;
GO

-- Quitter
EXIT
```

### 2.2 Si `sqlcmd` n'existe pas dans le conteneur

Installer `sqlcmd` dans le conteneur ou utiliser l'alternative depuis Node.js :

```bash
cd backend
node -e "
require('dotenv').config();
const sql = require('mssql');
(async () => {
    const pool = await sql.connect({
        server: 'localhost', port: 1433,
        user: 'sa', password: 'admin@12345',
        database: 'gestion_akoho',
        options: { encrypt: false, trustServerCertificate: true }
    });
    const result = await pool.request().query('SELECT * FROM description_race');
    console.table(result.recordset);
    await sql.close();
})();
"
```

---

## 3. Initialisation de la base de données

### 3.1 Supprimer la base (si besoin de repartir de zéro)

Si tu as changé la structure des tables, il faut **drop** la base et la recréer.

Depuis `sqlcmd` :

```sql
-- Se connecter
-- docker exec -it sqlserver-akoho /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "admin@12345" -C

-- Vérifier que la base existe
SELECT name FROM sys.databases;
GO

-- Supprimer la base (ferme toutes les connexions actives avant)
USE master;
GO
ALTER DATABASE gestion_akoho SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO
DROP DATABASE gestion_akoho;
GO
```

> **Equivalent MySQL :** `DROP DATABASE IF EXISTS gestion_akoho;`

### 3.2 Créer la base et les tables

Après le drop (ou lors de la première installation) :

```sql
-- Créer la base
CREATE DATABASE gestion_akoho;
GO

USE gestion_akoho;
GO

-- Table race (parent, nécessaire pour la FK)
CREATE TABLE race(
    Id_race INT IDENTITY PRIMARY KEY,
    nom VARCHAR(50),
    prix_sakafo FLOAT,
    prix_vente FLOAT,
    prix_vente_atody FLOAT
);
GO

-- Table description_race (enfant, FK vers race)
CREATE TABLE description_race(
    Id_description_race INT IDENTITY PRIMARY KEY,
    age INT,
    variation_poids FLOAT,
    lanja_sakafo FLOAT,
    Id_race INT NOT NULL,
    FOREIGN KEY(Id_race) REFERENCES race(Id_race)
);
GO
```

> `INT IDENTITY` = auto-increment (équivalent de `AUTO_INCREMENT` en MySQL).

Tu peux aussi exécuter directement le fichier `database/base.sql` qui contient toutes les tables :

```bash
# Copier le fichier SQL dans le conteneur
docker cp database/base.sql sqlserver-akoho:/tmp/base.sql

# Exécuter le script
docker exec -it sqlserver-akoho /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "admin@12345" -C -i /tmp/base.sql
```

### 3.3 Résumé des étapes (drop + recréation)

```bash
# 1. Se connecter au conteneur
docker exec -it sqlserver-akoho /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "admin@12345" -C

# 2. Dans sqlcmd, drop la base
USE master;
GO
ALTER DATABASE gestion_akoho SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO
DROP DATABASE gestion_akoho;
GO
EXIT

# 3. Exécuter le script de création
docker cp database/base.sql sqlserver-akoho:/tmp/base.sql
docker exec -it sqlserver-akoho /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "admin@12345" -C -i /tmp/base.sql
```

### 3.4 Insérer des données de test

```sql
-- Insérer une race
INSERT INTO race (nom, prix_sakafo, prix_vente, prix_vente_atody)
VALUES ('Brahma', 1500, 25000, 500);
GO

-- Insérer une description de race
-- age = âge en semaines (INT), variation_poids = en grammes (FLOAT), lanja_sakafo = en grammes (FLOAT)
INSERT INTO description_race (age, variation_poids, lanja_sakafo, Id_race)
VALUES (8, 500, 150, 1);
GO
```

---

## 4. Lancer le projet backend

### 4.1 Installer les dépendances

```bash
cd backend
npm install
```

### 4.2 Configurer le `.env`

Le fichier `backend/.env` contient la configuration :

```dotenv
PORT=3000
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=admin@12345
DB_NAME=gestion_akoho
```

> Adapter `DB_PASSWORD` si tu as mis un autre mot de passe lors du `docker run`.

### 4.3 Démarrer le serveur

```bash
# Mode développement (redémarre auto à chaque modification)
npm run dev

# Mode production
npm start
```

Le serveur sera accessible sur `http://localhost:3000`.

### 4.4 Tester l'API

```bash
# Health check
curl http://localhost:3000/api/health

# Lister toutes les descriptions
curl http://localhost:3000/api/description-races

# Créer une description (age=8 semaines, variation_poids=500g, lanja_sakafo=150g)
curl -X POST http://localhost:3000/api/description-races \
  -H "Content-Type: application/json" \
  -d '{"age": 8, "variation_poids": 500, "lanja_sakafo": 150, "Id_race": 1}'

# Récupérer par ID
curl http://localhost:3000/api/description-races/1

# Modifier
curl -X PUT http://localhost:3000/api/description-races/1 \
  -H "Content-Type: application/json" \
  -d '{"age": 12, "variation_poids": 800, "lanja_sakafo": 200, "Id_race": 1}'

# Supprimer
curl -X DELETE http://localhost:3000/api/description-races/1
```

---

## 5. Architecture du code (comparé avec Spring Boot)

### 5.1 Structure des dossiers

```
backend/
├── .env                              ← ≈ application.properties (Spring Boot)
├── package.json                      ← ≈ pom.xml (Maven)
└── src/
    ├── server.js                     ← ≈ main() dans @SpringBootApplication
    ├── app.js                        ← ≈ Configuration Spring (middlewares)
    ├── config/
    │   └── database.js               ← ≈ spring.datasource.* (config DB)
    ├── models/
    │   └── descriptionRace.model.js  ← ≈ @Entity
    ├── repositories/
    │   └── descriptionRace.repository.js ← ≈ @Repository (JpaRepository)
    ├── services/
    │   └── descriptionRace.service.js    ← ≈ @Service
    ├── controllers/
    │   └── descriptionRace.controller.js ← ≈ @RestController
    ├── routes/
    │   └── descriptionRace.routes.js     ← ≈ @RequestMapping / @GetMapping
    └── middlewares/
        └── errorHandler.js               ← ≈ @ControllerAdvice
```

### 5.2 Le flux d'une requête HTTP

```
Client (curl/navigateur)
    │
    ▼
routes/             → Définit les URL et les méthodes HTTP (GET, POST...)
    │                  ≈ @GetMapping, @PostMapping en Spring Boot
    ▼
controllers/        → Reçoit la requête, appelle le service, renvoie la réponse
    │                  ≈ @RestController en Spring Boot
    ▼
services/           → Logique métier + validation
    │                  ≈ @Service en Spring Boot
    ▼
repositories/       → Requêtes SQL vers la base de données
    │                  ≈ @Repository / JpaRepository en Spring Boot
    ▼
config/database.js  → Pool de connexion SQL Server
                       ≈ HikariCP + application.properties en Spring Boot
```

### 5.3 Explication de chaque couche

**`config/database.js`** — Connexion à la base de données  
Crée un pool de connexions réutilisable (singleton). En Spring Boot, c'est géré automatiquement par HikariCP via `application.properties`.

**`models/descriptionRace.model.js`** — Modèle de données  
Simple classe JS qui représente la table. En Spring Boot, c'est une classe annotée `@Entity` avec JPA.

**`repositories/descriptionRace.repository.js`** — Accès aux données  
Contient les requêtes SQL brutes (`SELECT`, `INSERT`, `UPDATE`, `DELETE`). En Spring Boot, JpaRepository génère ces requêtes automatiquement. Ici on les écrit à la main.

**`services/descriptionRace.service.js`** — Logique métier  
Valide les données et gère les erreurs (ex: 404 si non trouvé). Appelle le repository. En Spring Boot, c'est la classe `@Service`.

**`controllers/descriptionRace.controller.js`** — Gestion des requêtes HTTP  
Reçoit `req` (requête) et `res` (réponse), extrait les paramètres, appelle le service, et renvoie le JSON. En Spring Boot, c'est le `@RestController` avec `@RequestBody`, `@PathVariable`, etc.

**`routes/descriptionRace.routes.js`** — Définition des URL  
Associe chaque URL + méthode HTTP à une fonction du controller. En Spring Boot, ça correspond aux annotations `@GetMapping("/")`, `@PostMapping("/")`, etc.

**`middlewares/errorHandler.js`** — Gestion centralisée des erreurs  
Intercepte toutes les erreurs et renvoie une réponse JSON propre. En Spring Boot, c'est `@ControllerAdvice` avec `@ExceptionHandler`.

### 5.4 Différences clés Spring Boot vs Express

| Aspect | Spring Boot | Express.js |
|---|---|---|
| Injection de dépendances | `@Autowired` (automatique) | `require()` (manuelle) |
| ORM | JPA/Hibernate (automatique) | SQL brut avec `mssql` (manuel) |
| Validation | `@Valid` + annotations | Vérification manuelle dans le service |
| Gestion erreurs | `@ControllerAdvice` | Middleware `errorHandler` |
| Config | `application.properties` | `.env` + `dotenv` |
| Hot reload | Spring DevTools | `nodemon` |

---

## 6. Problèmes fréquents

### "Login failed for user 'sa'"
Le mot de passe dans `.env` ne correspond pas à celui du conteneur Docker. **Solution :**
```bash
# Supprimer l'ancien conteneur et en recréer un
docker stop sqlserver-akoho && docker rm sqlserver-akoho
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=admin@12345" -p 1433:1433 --name sqlserver-akoho -d mcr.microsoft.com/mssql/server:2022-latest
```

### "ECONNREFUSED 127.0.0.1:1433"
Le conteneur Docker n'est pas démarré. **Solution :**
```bash
docker start sqlserver-akoho
```

### Le port 1433 est déjà utilisé
Un autre conteneur ou service utilise le port. **Solution :**
```bash
docker ps  # voir quel conteneur utilise le port
# Ou utiliser un autre port :
docker run ... -p 1434:1433 ...
# Et changer DB_PORT=1434 dans .env
```
