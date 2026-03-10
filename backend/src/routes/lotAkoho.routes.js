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