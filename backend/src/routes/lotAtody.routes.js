const express = require('express');
const router = express.Router();
const lotAtodyController = require('../controllers/lotAtody.controller');

/**
 * @swagger
 * tags:
 *   name: LotsAtody
 *   description: Gestion des lots d'œufs
 */

/**
 * @swagger
 * /api/lots-atody:
 *   get:
 *     summary: Récupérer tous les lots d'œufs
 *     tags: [LotsAtody]
 *     responses:
 *       200:
 *         description: Liste de tous les lots d'œufs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LotAtody'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Créer un nouveau lot d'œufs
 *     tags: [LotsAtody]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LotAtodyInput'
 *     responses:
 *       201:
 *         description: Lot d'œufs créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LotAtody'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', lotAtodyController.getAll);
router.post('/', lotAtodyController.create);

/**
 * @swagger
 * /api/lots-atody/{id}:
 *   get:
 *     summary: Récupérer un lot d'œufs par son ID
 *     tags: [LotsAtody]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du lot d'œufs
 *     responses:
 *       200:
 *         description: Lot d'œufs trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LotAtody'
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
 *     summary: Mettre à jour un lot d'œufs
 *     tags: [LotsAtody]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du lot d'œufs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LotAtodyInput'
 *     responses:
 *       200:
 *         description: Lot d'œufs mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LotAtody'
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
 *     summary: Supprimer un lot d'œufs
 *     tags: [LotsAtody]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du lot d'œufs
 *     responses:
 *       200:
 *         description: Lot d'œufs supprimé avec succès
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
router.get('/:id', lotAtodyController.getById);
router.put('/:id', lotAtodyController.update);
router.delete('/:id', lotAtodyController.deleteById);

module.exports = router;
