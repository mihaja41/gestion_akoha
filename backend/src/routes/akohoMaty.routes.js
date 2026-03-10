const express = require('express');
const router = express.Router();
const akohoMatyController = require('../controllers/akohoMaty.controller');

/**
 * @swagger
 * tags:
 *   name: AkohoMaty
 *   description: Gestion des poulets morts
 */

/**
 * @swagger
 * /api/akoho-maty:
 *   get:
 *     summary: Récupérer tous les enregistrements de poulets morts
 *     tags: [AkohoMaty]
 *     responses:
 *       200:
 *         description: Liste de tous les enregistrements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AkohoMaty'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Enregistrer des poulets morts
 *     tags: [AkohoMaty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AkohoMatyInput'
 *     responses:
 *       201:
 *         description: Enregistrement créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AkohoMaty'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', akohoMatyController.getAll);
router.post('/', akohoMatyController.create);

/**
 * @swagger
 * /api/akoho-maty/{id}:
 *   get:
 *     summary: Récupérer un enregistrement par son ID
 *     tags: [AkohoMaty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'enregistrement
 *     responses:
 *       200:
 *         description: Enregistrement trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AkohoMaty'
 *       404:
 *         description: Enregistrement introuvable
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
 *     summary: Mettre à jour un enregistrement de poulets morts
 *     tags: [AkohoMaty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'enregistrement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AkohoMatyInput'
 *     responses:
 *       200:
 *         description: Enregistrement mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AkohoMaty'
 *       404:
 *         description: Enregistrement introuvable
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
 *     summary: Supprimer un enregistrement de poulets morts
 *     tags: [AkohoMaty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'enregistrement
 *     responses:
 *       200:
 *         description: Enregistrement supprimé avec succès
 *       404:
 *         description: Enregistrement introuvable
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
router.get('/:id', akohoMatyController.getById);
router.put('/:id', akohoMatyController.update);
router.delete('/:id', akohoMatyController.deleteById);

module.exports = router;
