/**
 * Middleware de gestion des erreurs centralisé.
 * 
 * ➜ Spring Boot : équivalent de @ControllerAdvice + @ExceptionHandler
 *
 *   @ControllerAdvice
 *   public class GlobalExceptionHandler {
 *       @ExceptionHandler(ResourceNotFoundException.class)
 *       public ResponseEntity<?> handleNotFound(ResourceNotFoundException e) { ... }
 *   }
 *
 * En Express, un middleware avec 4 paramètres (err, req, res, next)
 * intercepte toutes les erreurs propagées via next(error).
 */

function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const message = err.message || 'Erreur interne du serveur';

    console.error(`[ERROR] ${status} - ${message}`);

    res.status(status).json({
        success: false,
        status,
        message
    });
}

module.exports = errorHandler;
