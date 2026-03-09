class NaissanceOeuf {
    constructor({ Id_naissance_oeuf = null, nombre_poussin, date_naissance, Id_lot_atody }) {
        this.Id_naissance_oeuf = Id_naissance_oeuf;
        this.nombre_poussin = nombre_poussin;
        this.date_naissance = date_naissance;
        this.Id_lot_atody = Id_lot_atody;
    }
}

module.exports = NaissanceOeuf;
