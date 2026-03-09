class AkohoMaty {
    constructor({ Id_akoho_maty = null, date_mort, nombre, Id_lot_akoho }) {
        this.Id_akoho_maty = Id_akoho_maty;
        this.date_mort = date_mort;
        this.nombre = nombre;
        this.Id_lot_akoho = Id_lot_akoho;
    }
}

module.exports = AkohoMaty;
