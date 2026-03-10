const situationLotsService = require('../services/situationLots.service');

async function getSituationByDate(req, res, next) {
    try {
        const date = req.query.date;
        if (!date) {
            const error = new Error('Le paramètre "date" est obligatoire (format: YYYY-MM-DD)');
            error.status = 400;
            throw error;
        }
        res.json(await situationLotsService.getSituationByDate(date));
    } catch (error) { next(error); }
}

module.exports = { getSituationByDate };