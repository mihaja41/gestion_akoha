const lotAkohoService = require('./lotAkoho.service');

async function getSituationByDate(date) {
    const lots = await lotAkohoService.getLotAkohoBeforeDate(date);
    const situations = [];
    for (const lot of lots) {
        const situation = await lotAkohoService.getSituationByIdAndDate(lot.Id_lot_akoho, date);
        situations.push(situation);
    }
    return {
        date,
        nombreLots: situations.length,
        situations
    };
}

module.exports = { getSituationByDate };