# Créer / Réinitialiser la base de données

## Étape 1 — Vérifier que le conteneur tourne

```bash
docker ps
```

Tu dois voir quelque chose comme :
```
CONTAINER ID   IMAGE                                    PORTS
8dae4912c363   mcr.microsoft.com/mssql/server:2022-...  0.0.0.0:1433->1433/tcp
```

Si le conteneur **n'apparaît pas**, lance-le :
```bash
docker start sqlserver-akoho
```

---

## Étape 2 — Copier ton script SQL dans le conteneur

Depuis la racine du projet (`fiompiana-akoho/`) :

```bash
docker cp database/base.sql sqlserver-akoho:/tmp/base.sql
```

---

## Étape 3 — Exécuter le script

```bash
docker exec -it sqlserver-akoho /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "admin@12345" -C \
  -i /tmp/base.sql
```

Le script `base.sql` gère automatiquement :
- la **création** de la base `gestion_akoho` si elle n'existe pas
- le **drop** des tables existantes dans le bon ordre (respect des clés étrangères)
- la **recréation** de toutes les tables

> **Ordre de drop (important à cause des FK) :**
> `akoho_maty` → `naissance_oeuf` → `lot_atody` → `lot_akoho` → `description_race` → `race`

---

## Étape 4 — Vérifier que toutes les tables sont créées

```bash
docker exec -it sqlserver-akoho /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "admin@12345" -C \
  -Q "USE gestion_akoho; SELECT name FROM sys.tables;"
```

Résultat attendu :
```
name
------------------
race
description_race
lot_akoho
lot_atody
naissance_oeuf
akoho_maty
```

---

## Résumé en une seule commande

```bash
docker cp database/base.sql sqlserver-akoho:/tmp/base.sql && \
docker exec -it sqlserver-akoho /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "admin@12345" -C \
  -i /tmp/base.sql
```

---

## Pourquoi le fichier base.sql commence ainsi ?

SQL Server **ne supporte pas** `CREATE DATABASE IF NOT EXISTS` (syntax MySQL).
La syntaxe correcte est :

```sql
-- ✅ SQL Server
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'gestion_akoho')
BEGIN
    CREATE DATABASE gestion_akoho;
END
GO

-- De même pour les tables :
IF OBJECT_ID('akoho_maty', 'U') IS NOT NULL DROP TABLE akoho_maty;
```

| MySQL | SQL Server |
|---|---|
| `CREATE DATABASE IF NOT EXISTS db;` | `IF NOT EXISTS (...) CREATE DATABASE db;` |
| `DROP TABLE IF EXISTS t;` | `IF OBJECT_ID('t', 'U') IS NOT NULL DROP TABLE t;` |

---

## Problèmes fréquents

### Le script échoue avec "Cannot drop table because it is referenced by FOREIGN KEY"
Les tables doivent être droppées dans l'ordre inverse des dépendances.
Le fichier `base.sql` le fait déjà correctement.

### sqlcmd : commande introuvable
Essaie ce chemin alternatif :
```bash
docker exec -it sqlserver-akoho /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "admin@12345" \
  -i /tmp/base.sql
```

### Je ne connais pas le nom de mon conteneur
```bash
# Voir tous les conteneurs SQL Server
docker ps -a --filter "ancestor=mcr.microsoft.com/mssql/server:2022-latest"
```
Remplace `sqlserver-akoho` par le nom affiché dans la colonne `NAMES`.
