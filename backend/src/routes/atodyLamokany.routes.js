const express = require('express');
const router = express.Router();
const atodyLamokanyController = require('../controllers/atodyLamokany.controller');

/**
 * @swagger
 * tags:
 *   name: AtodyLamokany
 *   description: Gestion des œufs couvés gâtés (pourris)
 */

/**
 * @swagger
 * /api/atody-lamokany:
 *   get:
 *     summary: Récupérer tous les enregistrements d'œufs pourris
 *     tags: [AtodyLamokany]
 *     responses:
 *       200:
 *         description: Liste de tous les enregistrements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AtodyLamokany'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Enregistrer des œufs pourris
 *     tags: [AtodyLamokany]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtodyLamokanyInput'
 *     responses:
 *       201:
 *         description: Enregistrement créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AtodyLamokany'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', atodyLamokanyController.getAll);
router.post('/', atodyLamokanyController.create);

/**
 * @swagger
 * /api/atody-lamokany/{id}:
 *   get:
 *     summary: Récupérer un enregistrement par son ID
 *     tags: [AtodyLamokany]
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
 *               $ref: '#/components/schemas/AtodyLamokany'
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
 *     summary: Mettre à jour un enregistrement
 *     tags: [AtodyLamokany]
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
 *             $ref: '#/components/schemas/AtodyLamokanyInput'
 *     responses:
 *       200:
 *         description: Enregistrement mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AtodyLamokany'
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
 *     summary: Supprimer un enregistrement
 *     tags: [AtodyLamokany]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'enregistrement
 *     responses:
 *       204:
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
router.get('/:id', atodyLamokanyController.getById);
router.put('/:id', atodyLamokanyController.update);
router.delete('/:id', atodyLamokanyController.deleteById);

module.exports = router;
