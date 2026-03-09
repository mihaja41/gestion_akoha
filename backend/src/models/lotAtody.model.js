class LotAtody {
    constructor({ Id_lot_atody = null, numero, date_entree, nombre, Id_lot_akoho }) {
        this.Id_lot_atody = Id_lot_atody;
        this.numero = numero;
        this.date_entree = date_entree;
        this.nombre = nombre;
        this.Id_lot_akoho = Id_lot_akoho;
    }
}

module.exports = LotAtody;
