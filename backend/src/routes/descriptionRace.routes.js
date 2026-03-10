/**
 * Routes pour DescriptionRace.
 * 
 * ➜ Spring Boot : équivalent de @RequestMapping("/api/description-races") sur le controller.
 *   En Express, on sépare les routes dans un fichier dédié pour plus de clarté.
 *   C'est comme si le @RequestMapping était externalisé dans un fichier de configuration.
 */

const express = require('express');
const router = express.Router();
const descriptionRaceController = require('../controllers/descriptionRace.controller');

/**
 * Correspondance des routes avec Spring Boot :
 * 
 * | Express                        | Spring Boot                              |
 * |--------------------------------|------------------------------------------|
 * | router.get('/', ...)           | @GetMapping                              |
 * | router.get('/:id', ...)        | @GetMapping("/{id}")                     |
 * | router.post('/', ...)          | @PostMapping                             |
 * | router.put('/:id', ...)        | @PutMapping("/{id}")                     |
 * | router.delete('/:id', ...)     | @DeleteMapping("/{id}")                  |
 */

/**
 * @swagger
 * tags:
 *   name: DescriptionRaces
 *   description: Paramètres de croissance par race et par âge
 */

/**
 * @swagger
 * /api/description-races:
 *   get:
 *     summary: Récupérer toutes les descriptions de races
 *     tags: [DescriptionRaces]
 *     responses:
 *       200:
 *         description: Liste de toutes les descriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DescriptionRace'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Créer une description de race
 *     tags: [DescriptionRaces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DescriptionRaceInput'
 *     responses:
 *       201:
 *         description: Description créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DescriptionRace'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', descriptionRaceController.getAll);
router.post('/', descriptionRaceController.create);

/**
 * @swagger
 * /api/description-races/{id}:
 *   get:
 *     summary: Récupérer une description par son ID
 *     tags: [DescriptionRaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la description
 *     responses:
 *       200:
 *         description: Description trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DescriptionRace'
 *       404:
 *         description: Description introuvable
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
 *     summary: Mettre à jour une description de race
 *     tags: [DescriptionRaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la description
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DescriptionRaceInput'
 *     responses:
 *       200:
 *         description: Description mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DescriptionRace'
 *       404:
 *         description: Description introuvable
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
 *     summary: Supprimer une description de race
 *     tags: [DescriptionRaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la description
 *     responses:
 *       200:
 *         description: Description supprimée avec succès
 *       404:
 *         description: Description introuvable
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
router.get('/:id', descriptionRaceController.getById);
router.put('/:id', descriptionRaceController.update);
router.delete('/:id', descriptionRaceController.deleteById);

module.exports = router;
