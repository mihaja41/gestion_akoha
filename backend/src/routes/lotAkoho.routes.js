const express = require('express');
const router = express.Router();
const lotAkohoController = require('../controllers/lotAkoho.controller');

/**
 * @swagger
 * tags:
 *   name: LotsAkoho
 *   description: Gestion des lots de poulets
 */

/**
 * @swagger
 * /api/lots-akoho:
 *   get:
 *     summary: Récupérer tous les lots de poulets
 *     tags: [LotsAkoho]
 *     responses:
 *       200:
 *         description: Liste de tous les lots de poulets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LotAkoho'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Créer un nouveau lot de poulets
 *     tags: [LotsAkoho]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LotAkohoInput'
 *     responses:
 *       201:
 *         description: Lot créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LotAkoho'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', lotAkohoController.getAll);
router.post('/', lotAkohoController.create);

/**
 * @swagger
 * /api/lots-akoho/{id}/situation:
 *   get:
 *     summary: Obtenir la situation complète d'un lot de poulets à une date donnée
 *     tags: [LotsAkoho]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du lot de poulets
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date pour le calcul (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Situation du lot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 numero:
 *                   type: integer
 *                   description: Numéro du lot
 *                 nombreInitial:
 *                   type: integer
 *                   description: Nombre de poulets initial
 *                 prixAchatTotal:
 *                   type: number
 *                   description: Prix d'achat total du lot
 *                 valeurNourritureConsommee:
 *                   type: number
 *                   description: Valeur de la nourriture consommée (sans mort)
 *                 poidsMoyenParPoulet:
 *                   type: number
 *                   description: Poids moyen par poulet en grammes
 *                 prixVenteSansMort:
 *                   type: number
 *                   description: Prix de vente total sans compter les morts
 *                 nombreMorts:
 *                   type: integer
 *                   description: Nombre de poulets morts
 *                 nombreApresMort:
 *                   type: integer
 *                   description: Nombre de poulets restants
 *                 ageEnJour:
 *                   type: integer
 *                   description: Age du lot en jours
 *                 ageEnSemaine:
 *                   type: number
 *                   description: Age du lot en semaines
 *                 prixVenteAvecMort:
 *                   type: number
 *                   description: Prix de vente des poulets restants (après mort)
 *                 nombreOeufs:
 *                   type: integer
 *                   description: Nombre d'oeufs restants (total - naissances)
 *                 valeurOeufs:
 *                   type: number
 *                   description: Valeur des oeufs restants
 *                 beneficeSansMort:
 *                   type: number
 *                   description: Bénéfice sans compter les poulets morts
 *                 beneficeAvecMort:
 *                   type: number
 *                   description: Bénéfice en comptant les poulets morts
 *       400:
 *         description: Paramètre date manquant ou date invalide
 *       404:
 *         description: Lot introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id/situation', lotAkohoController.getSituation);

/**
 * @swagger
 * /api/lots-akoho/{id}:
 *   get:
 *     summary: Récupérer un lot de poulets par son ID
 *     tags: [LotsAkoho]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du lot de poulets
 *     responses:
 *       200:
 *         description: Lot trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LotAkoho'
 *       404:
 *         description: Lot introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Mettre à jour un lot de poulets
 *     tags: [LotsAkoho]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du lot de poulets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LotAkohoInput'
 *     responses:
 *       200:
 *         description: Lot mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LotAkoho'
 *       404:
 *         description: Lot introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Supprimer un lot de poulets
 *     tags: [LotsAkoho]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du lot de poulets
 *     responses:
 *       200:
 *         description: Lot supprimé avec succès
 *       404:
 *         description: Lot introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', lotAkohoController.getById);
router.put('/:id', lotAkohoController.update);
router.delete('/:id', lotAkohoController.deleteById);

module.exports = router;