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

router.get('/', descriptionRaceController.getAll);
router.get('/:id', descriptionRaceController.getById);
router.post('/', descriptionRaceController.create);
router.put('/:id', descriptionRaceController.update);
router.delete('/:id', descriptionRaceController.deleteById);

module.exports = router;
