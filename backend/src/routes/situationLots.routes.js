const express = require('express');
const router = express.Router();
const situationLotsController = require('../controllers/situationLots.controller');

/**
 * @swagger
 * tags:
 *   name: SituationLots
 *   description: Vue d'ensemble de la situation de tous les lots de poulets
 */

/**
 * @swagger
 * /api/situation-lots:
 *   get:
 *     summary: Obtenir la situation de tous les lots de poulets à une date donnée
 *     description: |
 *       Retourne la situation complète (financière et physique) de **tous les lots de poulets**
 *       dont la date d'entrée est antérieure ou égale à la date demandée.
 *
 *       Pour chaque lot, on calcule :
 *       - Le nombre de poulets initial et restant (après morts)
 *       - Le poids moyen par poulet
 *       - La valeur de la nourriture consommée (par tranche de vie)
 *       - Le prix de vente (avec et sans morts)
 *       - Le nombre d'œufs restants (total − naissances − œufs pourris)
 *       - Le bénéfice (avec et sans morts)
 *     tags: [SituationLots]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: '2026-03-10'
 *         description: Date pour le calcul de la situation (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Situation de tous les lots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: '2026-03-10'
 *                 nombreLots:
 *                   type: integer
 *                   description: Nombre total de lots trouvés
 *                   example: 3
 *                 situations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       numero:
 *                         type: integer
 *                         description: Numéro du lot
 *                       nombreInitial:
 *                         type: integer
 *                         description: Nombre de poulets initial
 *                       prixAchatTotal:
 *                         type: number
 *                         description: Prix d'achat total du lot
 *                       valeurNourritureConsommee:
 *                         type: number
 *                         description: Valeur totale de la nourriture consommée
 *                       poidsMoyenParPoulet:
 *                         type: number
 *                         description: Poids moyen par poulet (en grammes)
 *                       prixVenteSansMort:
 *                         type: number
 *                         description: Prix de vente total sans compter les morts
 *                       nombreMorts:
 *                         type: integer
 *                         description: Nombre de poulets morts
 *                       nombreApresMort:
 *                         type: integer
 *                         description: Nombre de poulets restants
 *                       ageEnJour:
 *                         type: integer
 *                         description: Âge du lot en jours
 *                       ageEnSemaine:
 *                         type: number
 *                         description: Âge du lot en semaines
 *                       prixVenteAvecMort:
 *                         type: number
 *                         description: Prix de vente des poulets restants
 *                       nombreOeufs:
 *                         type: integer
 *                         description: Nombre d'œufs restants
 *                       valeurOeufs:
 *                         type: number
 *                         description: Valeur des œufs restants
 *                       beneficeSansMort:
 *                         type: number
 *                         description: Bénéfice sans compter les poulets morts
 *                       beneficeAvecMort:
 *                         type: number
 *                         description: Bénéfice en comptant les poulets morts
 *       400:
 *         description: Paramètre date manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', situationLotsController.getSituationByDate);

module.exports = router;
