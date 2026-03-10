const express = require('express');
const router = express.Router();
const naissanceOeufController = require('../controllers/naissanceOeuf.controller');

/**
 * @swagger
 * tags:
 *   name: NaissancesOeuf
 *   description: Gestion des naissances de poussins
 */

/**
 * @swagger
 * /api/naissances-oeuf:
 *   get:
 *     summary: Récupérer toutes les naissances
 *     tags: [NaissancesOeuf]
 *     responses:
 *       200:
 *         description: Liste de toutes les naissances
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NaissanceOeuf'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Enregistrer une nouvelle naissance
 *     tags: [NaissancesOeuf]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NaissanceOeufInput'
 *     responses:
 *       201:
 *         description: Naissance enregistrée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NaissanceOeuf'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', naissanceOeufController.getAll);
router.post('/', naissanceOeufController.create);

/**
 * @swagger
 * /api/naissances-oeuf/{id}:
 *   get:
 *     summary: Récupérer une naissance par son ID
 *     tags: [NaissancesOeuf]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la naissance
 *     responses:
 *       200:
 *         description: Naissance trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NaissanceOeuf'
 *       404:
 *         description: Naissance introuvable
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
 *     summary: Mettre à jour une naissance
 *     tags: [NaissancesOeuf]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la naissance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NaissanceOeufInput'
 *     responses:
 *       200:
 *         description: Naissance mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NaissanceOeuf'
 *       404:
 *         description: Naissance introuvable
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
 *     summary: Supprimer une naissance
 *     tags: [NaissancesOeuf]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la naissance
 *     responses:
 *       200:
 *         description: Naissance supprimée avec succès
 *       404:
 *         description: Naissance introuvable
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
router.get('/:id', naissanceOeufController.getById);
router.put('/:id', naissanceOeufController.update);
router.delete('/:id', naissanceOeufController.deleteById);

module.exports = router;
