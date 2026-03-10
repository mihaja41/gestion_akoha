# Situation globale des lots — Règles de gestion

## Endpoint

```
GET /api/situation-lots?date=YYYY-MM-DD
```

Retourne la situation de **tous les lots de poulets** dont la date d'entrée est antérieure ou égale à la date demandée.

---

## 1. Principe

On a déjà le calcul de la situation d'**un seul** lot via `GET /api/lots-akoho/:id/situation?date=...` (voir [situation-lot-akoho.md](situation-lot-akoho.md)).

Cet endpoint **agrège** ce calcul pour **tous les lots existants** à une date donnée.

---

## 2. Démarche du code

### 2.1. Récupérer les lots concernés

On cherche dans la table `lot_akoho` tous les lots dont `date_entree <= date` :

```sql
SELECT * FROM lot_akoho WHERE date_entree <= @date
```

> Un lot entré le 15 Mars ne doit pas apparaître si on demande la situation au 10 Mars.

### 2.2. Calculer la situation de chaque lot

Pour chaque lot trouvé, on appelle `getSituationByIdAndDate(lot.Id_lot_akoho, date)` qui calcule individuellement :

- Poids moyen, nourriture consommée, prix de vente, morts, œufs, bénéfices…
- (Voir [situation-lot-akoho.md](situation-lot-akoho.md) pour le détail des formules)

### 2.3. Assembler la réponse

On retourne un objet contenant la date, le nombre de lots trouvés, et le tableau de toutes les situations.

---

## 3. Flux du code

```
Controller (situationLots.controller.js)
  │  Récupère le paramètre ?date=...
  │  Valide que la date est présente
  ▼
Service (situationLots.service.js)
  │  1. lotAkohoService.getLotAkohoBeforeDate(date)
  │     → SELECT * FROM lot_akoho WHERE date_entree <= @date
  │
  │  2. Pour chaque lot :
  │     lotAkohoService.getSituationByIdAndDate(id, date)
  │     → Calcul complet (voir situation-lot-akoho.md)
  │
  │  3. Retourne { date, nombreLots, situations: [...] }
  ▼
Controller → Renvoie le JSON au client
```

---

## 4. Fichiers impliqués

| Fichier | Rôle |
|---|---|
| `routes/situationLots.routes.js` | Définit `GET /api/situation-lots` |
| `controllers/situationLots.controller.js` | Valide le paramètre `date`, appelle le service |
| `services/situationLots.service.js` | Récupère les lots, boucle sur chaque lot |
| `services/lotAkoho.service.js` | `getLotAkohoBeforeDate()` + `getSituationByIdAndDate()` |
| `repositories/lotAkoho.repository.js` | `getLotAkohoBeforeDate()` — requête SQL |

---

## 5. Exemple de réponse

```
GET /api/situation-lots?date=2026-03-10
```

```json
{
  "date": "2026-03-10",
  "nombreLots": 2,
  "situations": [
    {
      "numero": 101,
      "nombreInitial": 100,
      "prixAchatTotal": 800000,
      "valeurNourritureConsommee": 45000,
      "poidsMoyenParPoulet": 350.5,
      "prixVenteSansMort": 876250,
      "nombreMorts": 10,
      "nombreApresMort": 90,
      "ageEnJour": 28,
      "ageEnSemaine": 4,
      "prixVenteAvecMort": 788625,
      "nombreOeufs": 200,
      "valeurOeufs": 100000,
      "beneficeSansMort": 131250,
      "beneficeAvecMort": 43625
    },
    {
      "numero": 102,
      "nombreInitial": 50,
      "prixAchatTotal": 400000,
      "valeurNourritureConsommee": 12000,
      "poidsMoyenParPoulet": 210.0,
      "prixVenteSansMort": 262500,
      "nombreMorts": 3,
      "nombreApresMort": 47,
      "ageEnJour": 14,
      "ageEnSemaine": 2,
      "prixVenteAvecMort": 246750,
      "nombreOeufs": 0,
      "valeurOeufs": 0,
      "beneficeSansMort": -149500,
      "beneficeAvecMort": -165250
    }
  ]
}
```

---

## 6. Relation avec les autres docs

- **[situation-lot-akoho.md](situation-lot-akoho.md)** — Détail du calcul pour **un seul** lot (nourriture par tranche de vie, poids moyen, œufs, bénéfices)
- **[init-project.md](init-project.md)** — Comment lancer le projet (Docker, base de données, serveur)
- **[reset-base.md](reset-base.md)** — Réinitialiser la base de données
