/**
 * Controller DescriptionRace — couche de présentation (Presentation Layer).
 * 
 * ➜ Spring Boot : équivalent d'une classe @RestController
 *
 *   @RestController
 *   @RequestMapping("/api/description-races")
 *   public class DescriptionRaceController {
 *       @Autowired
 *       private DescriptionRaceService service;
 *
 *       @GetMapping
 *       public ResponseEntity<List<DescriptionRace>> getAll() { ... }
 *
 *       @GetMapping("/{id}")
 *       public ResponseEntity<DescriptionRace> getById(@PathVariable int id) { ... }
 *       ...
 *   }
 *
 * Le controller reçoit les requêtes HTTP, appelle le service, et renvoie la réponse.
 * Il ne contient PAS de logique métier (tout comme en Spring Boot).
 */

const descriptionRaceService = require('../services/descriptionRace.service');

/**
 * GET /api/description-races
 * ➜ Spring Boot : @GetMapping
 */
async function getAll(req, res, next) {
    try {
        const data = await descriptionRaceService.getAll();
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/description-races/:id
 * ➜ Spring Boot : @GetMapping("/{id}") + @PathVariable
 */
async function getById(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const data = await descriptionRaceService.getById(id);
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/description-races
 * ➜ Spring Boot : @PostMapping + @RequestBody
 */
async function create(req, res, next) {
    try {
        const data = await descriptionRaceService.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/description-races/:id
 * ➜ Spring Boot : @PutMapping("/{id}") + @PathVariable + @RequestBody
 */
async function update(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const data = await descriptionRaceService.update(id, req.body);
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/description-races/:id
 * ➜ Spring Boot : @DeleteMapping("/{id}") + @PathVariable
 */
async function deleteById(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        await descriptionRaceService.deleteById(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById
};
